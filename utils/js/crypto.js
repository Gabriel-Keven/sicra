//Botão que envia o formulário
const sendButton = document.getElementById('sendButton');

//Botões para gerar os pares de chaves
const firstPairKeysButton = document.getElementById('firstPairKeysButton');
const NewPairKeysButton = document.getElementById('NewPairKeysButton');

//Botões para deletar o par de chaves
const deletePairKeysButton = document.getElementById('deletePairKeysButton');

//Div com as instruções para a geração do primeiro par de chaves
const cardFirstCreatePairOfKeys = document.getElementById('cardFirstCreatePairOfKeys');
//Div com as instruções para a geração de novos pares de chaves
const cardCreateNewPairOfKeys = document.getElementById('cardCreateNewPairOfKeys');

// Alerta para mensagens
const message = document.getElementById('message');
const contentMessage = document.getElementById('contentMessage');

//Verifica se as chaves foram criadas ou não
checkPairOfKeysIsCreated(cardFirstCreatePairOfKeys, cardCreateNewPairOfKeys);

//Interromper funcionamento padrão do botão
// sendButton.addEventListener('click', function(event) {
//     event.preventDefault(); // impede o envio do formulário
   
//     //Obtendo o arquivo
//     const inputFile = document.getElementById('file');
//     const file = inputFile.files[0];
    
//     //Verificação se o arquivo foi selecionado
//     if(!file)
//     {
//         console.log('Nenhum arquivo selecionado.')
//     }
//     else
//     {
//         //Leitura do arquivo com FileReader
//         const reader = new FileReader();
        
//         // Lê o arquivo como texto
//         reader.readAsText(file);

//         // Quando a leitura terminar
//         reader.onload = function(e) {
//             const text = e.target.result;
//             console.log(text); // exibe o conteúdo do arquivo

//         //Invocando biblioteca que realiza a criptografia
//         const crypt = new JSEncrypt();
//         crypt.setPrivateKey(
//             `MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDu6F0xMO9VeyOY
//             eltCGOHSdf2FmJIi3EjNRHcc6yNv5wvCO5PU46HHG8itxJUSqh5ZrROQIKXXNob2
//             wfBkTDM1r+I+DW5atCJMUqZ0qcETolu6SBveqelyXWpmM7YPgDtSNygifLrs8Rjq
//             eDTkrIuSBCG4k1ROYISs7mFDnSl7xglC+7IGpLZEPNWUYdAGLurfKuyDzi53WK6o
//             r1ctrFzjKvEfhTmLwpmGgmqvBkNip4R4JWEMfZO12dKZulH8G1df/S7JK83UEj+J
//             eccBEzNx4QZfZYJ9dnZVCwsBPysWfTJoku2W6rWZBJKv0dQbXxc+SUxW87/1kmY/
//             ybU++g2jAgMBAAECggEAFpQL5/qO8+OCVrEMRNqNz6e/q6DirBFo0/VqKGfUiTPV
//             uafgbcM25oFVXY7G4+UDSfMAdqOPPh/0xgdIIm0ifdVp1Uwhp3LUtvqB/rk4T78N
//             WjU3D7u7yJzUJw/bX0BS2uSZkhYlov+aHOFQEQ3O1vWLAPhI2cC8vox80WNd/fNn
//             lVePKWN+szkCw3mo08NOtxh1bXxVoshdNG1r4tCorTalM989hNmZVRDtUZOZC8gx
//             dQp4Qe+NCmbn1IKMfCONDatOqNeGdDHSVY6eE8R2V4oOe41o5GvtN6tJ+GioTicC
//             VYE+P+21pk0Wu4C4J93h3z5pnsZkbAO5TcsFux8W0QKBgQD8lmRNC7fj1H3uInJY
//             kQMsQRcdpFaNxdCOUCAvrpYukLKt/C8rnGKnktdsREmzTSLaFmVKKBFBtPvOvy6a
//             fgPT4syaFZME/nVTCTRaUtv8uuvPSk+8qdD46SJM+SoiKA9BIWoKby6vUegdvk08
//             NJHIWyra9bmUvIZJC6hqF083OQKBgQDyIqimkDRymRcYMocP2NwCFUXzTY85O7hg
//             L48ZmVL19q83o9WhwBJbPVpoMZO964Atj8i3MNBG9K0mgDDhv1AoqJZ6xB9IO5/E
//             h9ZIXGHrZJfbmiAL0tBBqFgNTlzlfVux2kQUnAEtcmIkYCkHQTjkzxMcD8muWqwV
//             3czphYNvuwKBgQDHGpV91hriUIHj0OtpvQVPQQ/DoeNIZgH77FUywOBJXG48j2lv
//             axqpFSsSgNHHsKokVzsItYTE0rEbS8Ckr2i9AS5e11rIuPwqtDq8aExYb8+p2t33
//             zbSYQM1094Oq4QEFSh2YlAOs11es+nFPX/D6ikLBzqi3AdSoh7P9zNn4oQKBgESj
//             ko90/Ykm4KcZW7QgU227vhKUf+9HgKKzmKs3DY9wGId7SAoMOqfmooQ62ZjS84j2
//             430at1AF+Debyz+TThPYhp/SjNObI1VA9HuaxJ9H6sxzynXPkv2pzRwohKkBekbW
//             isoU1zic3jlVkQvfb1NdaBtiVle4mGOydm4UTQgVAoGAfUNP5oiCZptnPVbGAbRa
//             SKqIzwzZGzEDqh65edetG7II0VnME3+XNXeyLbUmG1ipCVcTmI4JBuzfy+Xq0f4H
//             RA1Fm+Ib60QTvzf2lzU7iZU+7P+43KPIka3om+Q4tSsYNbT87Yro/YHJ+aU6bwLA
//             2nzt5EnM7vvksSqh2lg0HC4=`
//         );

//         const encrypted = crypt.encrypt(text);

//         const decrypted = crypt.decrypt(encrypted);

//         console.log('Original:', text);
//         console.log('Encrypted:', encrypted);
//         console.log('Decrypted:', decrypted);
//         console.log('Match:', text === decrypted); // true

//         };
//     }

// });

//Gerar o primeiro par de chaves
firstPairKeysButton.addEventListener('click', function(event) {
    generateRSAKeyPair();
    cardFirstCreatePairOfKeys.classList.add('d-none');
    cardCreateNewPairOfKeys.classList.remove('d-none');

});
//Gerar novo par de chaves
NewPairKeysButton.addEventListener('click', function(event) {
    generateRSAKeyPair();
});
deletePairKeysButton.addEventListener('click', function(event) {
    const confirmDeletePublicKey = confirm("Você tem certeza que deseja excluir sua chave pública atual?");
    if(confirmDeletePublicKey === true){
        deleteRSAKeyPair();
    }else{
        showMessage();
    }
});

async function generateRSAKeyPair() {
    message.classList.remove('d-none');
    contentMessage.textContent = `Gerando o par de chaves...`; 

      // 1. Gerarando o par de chaves RSA
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP", // (Optimal Asymmetric Encryption Padding) variação do RSA que evita ataques. Adiciona aletoriedade a chave
          modulusLength: 2048, //Tamanho 2048 bits
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256", //Função OAEP usa hash
        },
        true,
        ["encrypt", "decrypt"]
      );

      // 2. Exportar para PEM
      const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

      const publicPem = convertToPem(publicKey, "PUBLIC KEY");
      const privatePem = convertToPem(privateKey, "PRIVATE KEY");

      // 3. Baixar private.pem automaticamente (Não pode ser divulgada)
      downloadFile("private.pem", privatePem);

      // 4. Exibir a pública (pode também baixar ou enviar ao servidor)
        // console.log("🔑 Public Key PEM:\n", publicPem);

      await savePublicKey(publicPem);
}
async function deleteRSAKeyPair() {
    message.classList.remove('d-none');
    contentMessage.textContent = `Deletando a chave pública...`; 
     try {
        let response = await fetch("deletePublicKey", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            }
        });

        if (!response.ok) {
            throw new Error("Erro HTTP: " + response.status);
        }

        let data = await response.json();
        message.classList.remove('d-none');
        message.classList.remove('alert-primary');

        if(data.type == 'success'){
            message.classList.add('alert-success');
        }else{
            message.classList.add('alert-danger');
        }
        contentMessage.textContent = `Resposta: ${data.message}`; 
    } catch (error) {
        console.error("Falha ao enviar:", error);
        alert("Erro na requisição: " + error.message);
    }
}

// Converte ArrayBuffer para Base64 PEM
function convertToPem(keyBuffer, type) {
    const base64 = window.btoa(String.fromCharCode(...new Uint8Array(keyBuffer)));
    const formatted = base64.match(/.{1,64}/g).join("\n");
    return `-----BEGIN ${type}-----\n${formatted}\n-----END ${type}-----`;
}

// Faz download automático de arquivo
function downloadFile(filename, text) {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Salvar a chave pública no banco de dados
async function savePublicKey(publicKey) {
    try {
        let response = await fetch("insertPublicKey", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(publicKey) // converter objeto em JSON
        });

        if (!response.ok) {
            throw new Error("Erro HTTP: " + response.status);
        }

        let data = await response.json();
        message.classList.remove('d-none');
        message.classList.remove('alert-primary');

        if(data.type == 'success'){
            message.classList.add('alert-success');
        }else{
            message.classList.add('alert-danger');
        }
        contentMessage.textContent = `Resposta: ${data.message}`; 
    } catch (error) {
        console.error("Falha ao enviar:", error);
        alert("Erro na requisição: " + error.message);
    }
}

//Verificar se já existe um par de chaves criado
async function checkPairOfKeysIsCreated(cardFirstCreatePairOfKeys, cardCreateNewPairOfKeys){
     try {
        let response = await fetch("checkPairOfKeysIsCreated", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            }
        });

        if (!response.ok) {
            throw new Error("Erro HTTP: " + response.status);
        }

        let data = await response.json();
        if(data.type == 'success'){
            cardFirstCreatePairOfKeys.classList.remove('d-none');
        }else{
            cardCreateNewPairOfKeys.classList.remove('d-none');
        }
    } catch (error) {
        console.error("Falha ao enviar:", error);
        alert("Erro na requisição: " + error.message);
    }
}

//Mensagens para o usuário
function showMessage (type,textMessage){
    message.classList.remove('d-none');
    console.log(message.classList);

    // setTimeout(function() {
    //     window.location.href = "crypto";
    // }, 1500); // 1,5s
}