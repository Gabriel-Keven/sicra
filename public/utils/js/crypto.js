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
    const recipientId = selectIdRecipientOption.value;

    if (!publicKeySelected) {
        showMessage("warning", "Não foi possível obter a chave pública do destinatário.");
        return;
    }

    showMessage("info", "Iniciando criptografia híbrida...");

    try {
        //Gerar uma chave AES-GCM (simétrica) e um IV (Vetor de Inicialização)
        // Esta chave será usada para criptografar o *arquivo*
        const aesKey = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true, // Chave exportável
            ["encrypt", "decrypt"]
        );

        // O IV (nonce) deve ser único para cada criptografia com a mesma chave
        // 96 bits é o ideal para GCM
        const iv = window.crypto.getRandomValues(new Uint8Array(12)); 
        
        //Ler o arquivo e criptografá-lo com AES-GCM
        const arrayBuffer = await file.arrayBuffer();
        
        const encryptedFileBuffer = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            aesKey,
            arrayBuffer // Criptografa o buffer inteiro do arquivo
        );

        // Criptografar a chave AES com a chave pública RSA
        
        // Exportar a chave AES para o formato raw para que seja possível enviar
        const exportedAesKeyBuffer = await window.crypto.subtle.exportKey("raw", aesKey);
        
        // Converter a chave AES (ArrayBuffer) para Base64 (string)
        // btoa para converter os bytes brutos em uma string Base64
        const aesKeyBase64 = btoa(
            Array.from(new Uint8Array(exportedAesKeyBuffer), byte => String.fromCharCode(byte)).join('')
        );

        // JSEncrypt para criptografar a *string Base64* da chave AES
        const crypt = new JSEncrypt();
        crypt.setPublicKey(publicKeySelected);
        const encryptedAesKey = crypt.encrypt(aesKeyBase64);

        if (!encryptedAesKey) {
            showMessage("error", "Erro ao criptografar a chave simétrica (AES) com RSA.");
            return;
        }

        // Converter o arquivo criptografado (buffer) e o IV (buffer) para Base64
        // JSON não suporta ArrayBuffers, então converte tudo para Base64
        const encryptedFileBase64 = btoa(
             Array.from(new Uint8Array(encryptedFileBuffer), byte => String.fromCharCode(byte)).join('')
        );
        const ivBase64 = btoa(
             Array.from(iv, byte => String.fromCharCode(byte)).join('')
        );

        // Envinado o payload para o backend
        showMessage("info", "Enviando arquivo criptografado...");
        
        const result = await apiRequest(API.sendFileCrypted, "POST", {
            fileName: file.name,
            fileType: file.type,
            recipientId: recipientId,
            encryptedKey: encryptedAesKey,  // A chave AES (em Base64), criptografada com RSA
            iv: ivBase64,                 // O Vetor de Inicialização (em Base64)
            encryptedFile: encryptedFileBase64 // O arquivo (em Base64), criptografado com AES
        });

        if (result.type === 'success') {
            showMessage("success", result.message);
            inputFile.value = ''; // Limpa o input do arquivo
        } else {
            showMessage("error", result.message);
        }

    } catch (error) {
        showMessage("error", `Erro inesperado durante a criptografia: ${error.message}`);
    }
});
    
