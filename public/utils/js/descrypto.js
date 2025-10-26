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
    getEncryptedFile: "getEncryptedFile",
    downloadFile: "/files/download/" // O ID será concatenado
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

    // 1. Validar seleção do arquivo
    const fileIdToDownload = selectIdSender.value;
    if (!fileIdToDownload) {
        showMessage("warning", "Nenhum arquivo selecionado no menu.");
        return;
    }

    // 2. Validar seleção da chave privada
    const privateKeyFile = privateKeyInput.files[0];
    if (!privateKeyFile) {
        showMessage("warning", "Nenhuma chave privada (.pem) selecionada.");
        return;
    }

    showMessage("info", "Carregando chave privada e baixando arquivo...");

    // 3. Ler o arquivo da chave privada
    const reader = new FileReader();
    reader.readAsText(privateKeyFile);

    // 4. Quando a chave estiver lida, iniciar o processo
    reader.onload = async function(e) {
        const privateKeyPem = e.target.result;

        if (!privateKeyPem) {
            showMessage("error", "Não foi possível ler o conteúdo da chave privada.");
            return;
        }

        try {
            // 5. Baixar o conteúdo JSON criptografado do backend
            const downloadUrl = API.downloadFile + fileIdToDownload;
            const encryptedData = await apiRequest(downloadUrl, "GET");

            if (encryptedData.type === 'error' || !encryptedData.encryptedKey) {
                showMessage("error", encryptedData.message || "Falha ao baixar os dados do arquivo.");
                return;
            }

            // 6. Iniciar a descriptografia híbrida
            showMessage("info", "Iniciando descriptografia... Isso pode levar um momento.");

            // 6a. Descriptografar a Chave AES (com RSA)
            const crypt = new JSEncrypt();
            crypt.setPrivateKey(privateKeyPem);
            
            const decryptedAesKeyBase64 = crypt.decrypt(encryptedData.encryptedKey);
            if (!decryptedAesKeyBase64) {
                throw new Error("Falha ao descriptografar a chave do arquivo. Sua chave privada está correta?");
            }

            // 6b. Converter Chave AES, IV e Arquivo de Base64 para ArrayBuffer
            const aesKeyBuffer = base64ToArrayBuffer(decryptedAesKeyBase64);
            const ivBuffer = base64ToArrayBuffer(encryptedData.iv);
            const encryptedFileBuffer = base64ToArrayBuffer(encryptedData.encryptedFile);

            // 6c. Importar a Chave AES
            const aesKey = await window.crypto.subtle.importKey(
                "raw",
                aesKeyBuffer,
                { name: "AES-GCM", length: 256 },
                true,
                ["decrypt"]
            );

            // 6d. Descriptografar o Arquivo (com AES)
            const decryptedFileBuffer = await window.crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: ivBuffer
                },
                aesKey,
                encryptedFileBuffer
            );

            // 7. Sucesso! Disparar o download
            showMessage("success", "Arquivo descriptografado com sucesso! Iniciando download.");
            triggerDownload(encryptedData.fileName, encryptedData.fileType, decryptedFileBuffer);
            
            // Limpar campos
            privateKeyInput.value = '';

        } catch (error) {
            showMessage("error", `Falha na descriptografia: ${error.message}`);
        }
    };

    reader.onerror = function() {
        showMessage("error", "Falha ao ler o arquivo da chave privada.");
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
function base64ToArrayBuffer(base64) {
    try {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    } catch (e) {
        showMessage("error", "Erro ao decodificar dados (Base64).");
        throw new Error("Falha ao converter Base64.");
    }
}

/**
 * Dispara o download de um arquivo no navegador.
 */
function triggerDownload(fileName, fileType, buffer) {
    const blob = new Blob([buffer], { type: fileType || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName; // O nome original do arquivo
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

