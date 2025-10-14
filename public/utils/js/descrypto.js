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
        option.dataset.fileName = file.filename;

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

    // Lê o arquivo da chave privada
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async function(e) {
        const contentTextPrivateKey = cleanPrivateKey(e.target.result);

        const crypt = new JSEncrypt();
        crypt.setPrivateKey(contentTextPrivateKey);

        const selectIdSenderOption = selectIdSender.options[selectIdSender.selectedIndex];
        const fileNameSelected = selectIdSenderOption.dataset.fileName;
        const filePathSelected = selectIdSenderOption.dataset.filePath;
        const uploadFileId = selectIdSenderOption.value;

        if (!filePathSelected) {
            showMessage("warning", "Caminho do arquivo criptografado não encontrado.");
            return;
        }

        // Busca os blocos criptografados da API
        const result = await apiRequest(API.getEncryptedFile, "POST", {
            uploadFileId,
            fileNameSelected,
            filePathSelected
        });

        if (!result || !Array.isArray(result.encryptedBlocks)) {
            showMessage("error", "Erro ao recuperar os blocos criptografados.");
            return;
        }

        const encryptedBlocks = result.encryptedBlocks;
        let decryptedContent = '';

        showMessage("info", "Descriptografando... aguarde.");

        // Descriptografa cada bloco
        for (let i = 0; i < encryptedBlocks.length; i++) {
            const decryptedBlock = crypt.decrypt(encryptedBlocks[i]);
            if (decryptedBlock === null) {
                showMessage("error", `Erro ao descriptografar bloco ${i + 1}.`);
                return;
            }
            decryptedContent += decryptedBlock;
        }

        // Cria o arquivo e faz download
        const blob = new Blob([decryptedContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileNameSelected.replace('.enc', ''); // remove .enc do nome
        a.click();
        URL.revokeObjectURL(url);

        showMessage("success", `Arquivo "${fileNameSelected}" descriptografado e salvo com sucesso!`);
    };
});

//Limpar cabeçalho e rodapé da chve privada
function cleanPrivateKey(pemKey) {
    return pemKey
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\r?\n|\r/g, '')
        .trim();
}
