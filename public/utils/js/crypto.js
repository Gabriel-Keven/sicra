// =============================
// Seletores globais
// =============================

// Botões
const buttonSendFile = document.getElementById('buttonSendFile');
const buttonFirstPairKeys = document.getElementById('buttonFirstPairKeys');
const buttonNewPairKeys = document.getElementById('buttonNewPairKeys');
const buttonDeletePublicKey = document.getElementById('buttonDeletePublicKey');

// Divs (cards)
const cardFirstCreatePairOfKeys = document.getElementById('cardFirstCreatePairOfKeys');
const cardCreateNewPairOfKeys = document.getElementById('cardCreateNewPairOfKeys');
const cardDeletePairOfKeys = document.getElementById('cardDeletePairOfKeys');
const cardTablePublicKey = document.getElementById('cardTablePublicKey');
const cardTablePublicKeyUsers = document.getElementById('cardTablePublicKeyUsers');

// Tabelas
const tablePublicKeyContent = document.getElementById('tablePublicKeyContent');
const tablePublicKeyUsersContent = document.getElementById('tablePublicKeyUsersContent');

//Select
const selectIdRecipient = document.getElementById('selectIdRecipient');

// Alerta para mensagens
const message = document.getElementById('message');
const contentMessage = document.getElementById('contentMessage');

// Endpoints API
const API = {
    insertPublicKey: "insertPublicKey",
    deletePublicKey: "deletePublicKey",
    checkPublicKey:  "checkPublicKey",
    searchUsersHavePublicKey: "searchUsersHavePublicKey",
    sendFileCrypted: "sendFileCrypted"
};

// =============================
// Inicialização
// =============================
showInitialCard();
showTableUsersHavePublicKey();
showUsersToSendFile();

// =============================
// Funções de UI
// =============================
function isCardVisible(card) {
    return !card.classList.contains('d-none');
}

function showCard(card) {
    if (!isCardVisible(card)) {
        card.classList.remove('d-none');
    }
}

function hideCard(card) {
    if (isCardVisible(card)) {
        card.classList.add('d-none');
    }
}

function showMessage(type, textMessage) {
    message.classList.remove('d-none', 'alert-success', 'alert-warning', 'alert-danger', 'alert-primary');

    switch (type) {
        case "error":   message.classList.add('alert-danger'); break;
        case "success": message.classList.add('alert-success'); break;
        case "warning": message.classList.add('alert-warning'); break;
        default:        message.classList.add('alert-primary'); break;
    }

    contentMessage.textContent = textMessage;

    // Mensagens de info somem sozinhas
    if (type === "" || type === "info") {
        setTimeout(() => message.classList.add('d-none'), 2000);
    }
}

// =============================
// API Helpers
// =============================
async function apiRequest(endpoint, method = "POST", body = null) {
    try {
        const response = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : null
        });

        if (!response.ok) throw new Error("Erro HTTP: " + response.status);
        return await response.json();
    } catch (error) {
        showMessage("error", `Erro: ${error.message}`);
        return { type: "error", message: error.message };
    }
}

// =============================
// Controle de exibição inicial
// =============================
async function showInitialCard() {
    const result = await apiRequest(API.checkPublicKey);
    if (result.type === 'success') {
        showCard(cardCreateNewPairOfKeys);
        showCard(cardDeletePairOfKeys);
        showCard(cardTablePublicKey);
       
    } else {
        showCard(cardFirstCreatePairOfKeys);
    }
    await showPublicKeyTable(); //Preencher a tabela com a chave pública
}

// =============================
// Inserção da chave pública na tabela
// =============================
async function showPublicKeyTable() {
    const result = await apiRequest(API.checkPublicKey);
    tablePublicKeyContent.textContent = '';
    const newRow = document.createElement('tr');
    const cellPublicKey = document.createElement('td');
    if (result.type === 'success') {
        cellPublicKey.textContent = result.publicKey;
    } else {
        cellPublicKey.textContent = 'Você ainda não possui uma chave pública.';
    }
    newRow.appendChild(cellPublicKey);
    tablePublicKeyContent.appendChild(newRow);
}

// =============================
// Geração e exclusão de chaves
// =============================
async function generateRSAKeyPair() {
    showMessage("info", "Gerando o par de chaves...");

    // 1. Gerar par de chaves
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    );

    // 2. Exportar para PEM
    const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    const publicPem = convertToPem(publicKey, "PUBLIC KEY");
    const privatePem = convertToPem(privateKey, "PRIVATE KEY");

    // 3. Download automático da chave privada
    downloadFile("private.pem", privatePem);

    // 4. Salvar chave pública no backend
    const result = await apiRequest(API.insertPublicKey, "POST", { publicKey: publicPem });

    if (result.type === 'success') {
        showMessage("success", result.message);
        return { success: true, message: result.message };
    } else {
        showMessage("error", result.message);
        return { success: false, message: result.message };
    }
}

async function deletePublicKey() {
    showMessage("info", "Excluindo a chave pública...");

    const result = await apiRequest(API.deletePublicKey);

    if (result.type === 'success') {
        showMessage("success", result.message);
        return { success: true, message: result.message };
    } else {
        showMessage("error", result.message);
        return { success: false, message: result.message };
    }
}
// =============================
// Exibição dos usuários que têm a chave pública
// =============================
async function searchUsersHavePublicKey() {
    const result = await apiRequest(API.searchUsersHavePublicKey);
    if (result.type === 'success') {
        showMessage("success", result.message);
        return { success: true, message: result.message, users: result.users };
    } else {
        showMessage("error", result.message);
        return { success: false, message: result.message, users: result.users };
    }
}
async function showTableUsersHavePublicKey() {
    const result = await apiRequest(API.searchUsersHavePublicKey);

    // Limpa o conteúdo da tabela
    tablePublicKeyUsersContent.textContent = '';

    // Percorre cada usuário
    result.users.forEach(user => {
    // Cria nova linha
    const newRow = document.createElement('tr');

    // Cria as células
    const cellId = document.createElement('td');
    const cellName = document.createElement('td');
    const cellEmail = document.createElement('td');
    const cellPublicKey = document.createElement('td');

    // Preenche os dados
    cellId.textContent = user.id;
    cellName.textContent = user.name;
    cellEmail.textContent = user.email;
    cellPublicKey.textContent = user.public_key;

    // Adiciona as células à linha
    newRow.appendChild(cellId);
    newRow.appendChild(cellName);
    newRow.appendChild(cellEmail);
    newRow.appendChild(cellPublicKey);

    // Adiciona a linha à tabela
    tablePublicKeyUsersContent.appendChild(newRow);
});

}
// =============================
// Seleção dos usuários para enviar o arquivo
// =============================

async function showUsersToSendFile (){
    const result = await apiRequest(API.searchUsersHavePublicKey);
    selectIdRecipient.innerHTML = ''; //Limpa o select

    // Adiciona uma option para cada usuário
    result.users.forEach(user => {
        const option = document.createElement('option');
        
        // Você pode usar o que quiser como "value". Aqui, estou usando o email
        option.value = user.id;

        // O texto visível no select
        option.textContent = `${user.name} (${user.email})`;

        // Data attributes
        option.dataset.publicKey = user.public_key;

        selectIdRecipient.appendChild(option);
        });
}

// =============================
// Utilitários
// =============================
function convertToPem(keyBuffer, type) {
    const base64 = window.btoa(String.fromCharCode(...new Uint8Array(keyBuffer)));
    const formatted = base64.match(/.{1,64}/g).join("\n");
    return `-----BEGIN ${type}-----\n${formatted}\n-----END ${type}-----`;
}

function downloadFile(filename, text) {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// =============================
// Eventos
// =============================
buttonFirstPairKeys.addEventListener('click', async () => {
    const result = await generateRSAKeyPair();
    if (result.success) {
        hideCard(cardFirstCreatePairOfKeys);
        showCard(cardCreateNewPairOfKeys);
        showCard(cardDeletePairOfKeys);
        showCard(tablePublicKeyContent);
    }
    await showPublicKeyTable();
});

buttonNewPairKeys.addEventListener('click', async () => {
    const result = await generateRSAKeyPair();
    if (result.success === true) {
        hideCard(cardFirstCreatePairOfKeys);
        showCard(cardCreateNewPairOfKeys); 
        showCard(cardDeletePairOfKeys);
        showCard(tablePublicKeyContent);
        
    }
    await showPublicKeyTable(); 
});

buttonDeletePublicKey.addEventListener('click', async () => {
    if (confirm("Você tem certeza que deseja excluir sua chave pública atual?")) {
        const resultDeletePublicKey = await deletePublicKey();
        if(resultDeletePublicKey.success === true){
            showMessage('success','Chave pública excluída com sucesso.');
            hideCard(tablePublicKeyContent);
            hideCard(cardDeletePairOfKeys);
            hideCard(cardCreateNewPairOfKeys);
            showCard(cardFirstCreatePairOfKeys);
        }else{
            showMessage('error','Chave pública não excluída.');
        }
    }else {
        showMessage("warning", "Chave pública não excluída.");
    }
    await showPublicKeyTable();
});

buttonSendFile.addEventListener('click', async function(event) {
    event.preventDefault();

    const inputFile = document.getElementById('file');
    const file = inputFile.files[0];

    if (!file) {
        showMessage("warning", "Nenhum arquivo selecionado.");
        return;
    }

    const selectIdRecipientOption = selectIdRecipient.options[selectIdRecipient.selectedIndex];
    const publicKeySelected = selectIdRecipientOption.dataset.publicKey;
    const recipientId = selectIdRecipientOption.value; // Obter ID do receptor

    if (!publicKeySelected) {
        showMessage("warning", "Não foi possível obter a chave pública do destinatário.");
        return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const crypt = new JSEncrypt();
    crypt.setPublicKey(publicKeySelected);

    const blockSize = 190; // <= 245 bytes máximo, margem de segurança para padding
    const encryptedBlocks = [];

    for (let i = 0; i < buffer.length; i += blockSize) {
        const chunk = buffer.slice(i, i + blockSize);

        // Convertemos o chunk para string antes de criptografar (RSA trabalha com strings)
        const chunkStr = String.fromCharCode(...chunk);
        const encrypted = crypt.encrypt(chunkStr);

        if (!encrypted) {
            showMessage("error", `Erro ao criptografar bloco ${i / blockSize + 1}`);
            return;
        }

        encryptedBlocks.push(encrypted);
    }

    // Envio do JSON
    const result = await apiRequest(API.sendFileCrypted, "POST", {
        fileName: file.name,
        fileType: file.type,
        recipientId: recipientId,
        encryptedBlocks: encryptedBlocks
    });

    if (result.type === 'success') {
        showMessage("success", result.message);
    } else {
        showMessage("error", result.message);
    }
});

    
