// =============================
// Seletores globais
// =============================

// Botões
const buttonSend = document.getElementById('buttonSend');
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

// Alerta para mensagens
const message = document.getElementById('message');
const contentMessage = document.getElementById('contentMessage');

// Endpoints API
const API = {
    insertPublicKey: "insertPublicKey",
    deletePublicKey: "deletePublicKey",
    checkPublicKey:  "checkPublicKey",
    searchUsersHavePublicKey: "searchUsersHavePublicKey"
};

// =============================
// Inicialização
// =============================
showInitialCard();
showTableUsersHavePublicKey();

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
    tablePublicKeyUsersContent.textContent = '';
    const newRow = document.createElement('tr');
    const cellPublicKeyUsersName = document.createElement('td');
    const cellPublicKeyUsersEmail = document.createElement('td');
    const cellPublicKeyUsersPublicKey = document.createElement('td');

    Object.keys(result.users).forEach(key => {
        console.log(`Key: ${key}, Value: ${result.users[key]}`);
    });
    

    // if (result.type === 'success') {
    //     cellPublicKeyUsersName.textContent = result.publicKey;
    //     cellPublicKeyUsersEmail.textContent = result.publicKey;
    //     cellPublicKeyUsersPublicKey.textContent = result.publicKey;
    // } else {
    //     cellPublicKeyUsersName.textContent = '';
    //     cellPublicKeyUsersEmail.textContent = '';
    //     cellPublicKeyUsersPublicKey.textContent = '';
    // }
    // newRow.appendChild(cellPublicKeyUsers);
    // tablePublicKeyUsersContent.appendChild(newRow);
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
