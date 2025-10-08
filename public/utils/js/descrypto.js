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
    searchCryptedFiles: "searchCryptedFiles",
    getEncryptedFile: "getEncryptedFile"
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
    
    //Leitura do arquivo com FileReader
    const reader = new FileReader();

    // Lê o arquivo como texto
    reader.readAsText(file);
    //Quando a leitura terminar
    reader.onload = async function(e) {
        const contentTextPrivateKey = cleanPrivateKey(e.target.result);
        console.log(contentTextPrivateKey);

        //Invocando biblioteca que realiza a criptografia
        const crypt = new JSEncrypt();
        crypt.setPrivateKey(contentTextPrivateKey)

        const selectIdSenderOption = selectIdSender.options[selectIdSender.selectedIndex];
        const filePathSelected = selectIdSenderOption.dataset.filePath;
        console.log(filePathSelected);
        const uploadFileId = selectIdSenderOption.value; // Obter ID do receptor

        if (!filePathSelected) {
            showMessage("warning", "Não foi o caminho do arquivo criptografado que foi feito upload.");
            return;
        }
        // Busca os blocos criptografados da API
        const result = await apiRequest(API.getEncryptedFile, "POST", {
            uploadFileId: uploadFileId,
            filePathSelected: filePathSelected
        });


        if (!result || !result.encryptedBlocks || !Array.isArray(result.encryptedBlocks)) {
            showMessage("error", "Erro ao recuperar os blocos criptografados.");
            return;
        }
        const encryptedBlocks = response.encryptedBlocks;
        console.log(encryptedBlocks);

        if (result.type === 'success') {
            showMessage("success", result.message);
        } else {
            showMessage("error", result.message);
        }
    }
});

//Limpar cabeçalho e rodapé da chve privada
function cleanPrivateKey(pemKey) {
    return pemKey
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\r?\n|\r/g, '')
        .trim();
}
