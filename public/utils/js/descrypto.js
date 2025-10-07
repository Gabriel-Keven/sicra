// =============================
// Seletores globais
// =============================

// Botões
const buttonDownloadFile = document.getElementById('buttonDownloadFile');
const buttonDeletePublicKey = document.getElementById('buttonDeletePublicKey');

// Divs (cards)

// Tabelas
const tableDownloadsFile = document.getElementById('tableDownloadsFile');
const tableDownloadsFileContent = document.getElementById('tableDownloadsFileContent');

//Select
const selectIdSender = document.getElementById('selectIdSender');

// Alerta para mensagens
const message = document.getElementById('message');
const contentMessage = document.getElementById('contentMessage');

// Endpoints API
const API = {
    searchCryptedFiles: "searchCryptedFiles"
};

// =============================
// Inicialização
// =============================
showTableDownloadEncryptedFiles();
showFilesToDownload();

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
// Exibição dos usuários que têm a chave pública
// =============================
async function searchCryptedFiles() {
    const result = await apiRequest(API.searchCryptedFiles);
    if (result.type === 'success') {
        showMessage("success", result.message);
        return { success: true, message: result.message, files: result.files };
    } else {
        showMessage("warning", result.message);
        return { success: false, message: result.message, filse: result.files};
    }
}
async function showTableDownloadEncryptedFiles() {
    const result = await apiRequest(API.searchCryptedFiles);

    // Limpa o conteúdo da tabela
    showTableDownloadEncryptedFiles.textContent = '';

    // Percorre cada usuário
    result.files.forEach(file => {
    // Cria nova linha
    const newRow = document.createElement('tr');

    // Cria as células
    const cellIdUpload = document.createElement('td');
    const cellIdSender = document.createElement('td');
    const cellNameSender = document.createElement('td');
    const cellFileName = document.createElement('td');
    const cellUploadedAt = document.createElement('td');

    // Preenche os dados
    cellIdUpload.textContent = file.upload_id;
    cellIdSender.textContent = file.sender_id;
    cellNameSender.textContent = file.name_sender;
    cellFileName.textContent = file.filename;
    cellUploadedAt.textContent = file.uploaded_at;

    // Adiciona as células à linha
    newRow.appendChild(cellIdUpload);
    newRow.appendChild(cellIdSender);
    newRow.appendChild(cellNameSender);
    newRow.appendChild(cellFileName);
    newRow.appendChild(cellUploadedAt);

    // Adiciona a linha à tabela
    tableDownloadsFileContent.appendChild(newRow);
});

}
// =============================
// Seleção do arquivo para download enviar o arquivo
// =============================

async function showFilesToDownload (){
    const result = await apiRequest(API.searchCryptedFiles);
    selectIdSender.innerHTML = ''; //Limpa o select

    // Adiciona uma option para cada usuário
    result.files.forEach(file => {
        const option = document.createElement('option');
        
        // Você pode usar o que quiser como "value". Aqui, estou usando o email
        option.value = file.upload_id;

        // O texto visível no select
        option.textContent = `Nome do arquivo: ${file.filename} - Emissor: (${file.name_sender}) - Data: ${file.uploaded_at}`;

        // Data attributes
        option.dataset.filePath = file.file_path;

        selectIdSender.appendChild(option);
        });
}

// =============================
// Eventos
// =============================


buttonDownloadFile.addEventListener('click', async function(event) {
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

    
