// Alerta para mensagens
const message = document.getElementById('message');
const contentMessage = document.getElementById('contentMessage');

// Botão que envia o formulário
const loginButton = document.getElementById('loginButton');

// Interromper funcionamento padrão do botão
loginButton.addEventListener('click', function(event) {
    event.preventDefault();
    // Obter os valores do formulário e remover espaços extras
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Status do formulário após verificações
    const statusFormChecked = checkForms(email, password);

    if (statusFormChecked === true) {
        const user = {
            email: email,
            password: password
        };

        // Chamar a função para enviar os dados
        loginUser(user);
    } else {
        // Não enviar dados para o controller
        console.log("Formulário inválido, não enviado.");
    }
});

// Função que envia os dados para o Controller
async function loginUser(user) {
    try {
        let response = await fetch("login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(user) // converter objeto em JSON
        });

        if (!response.ok) {
            throw new Error("Erro HTTP: " + response.status);
        }

        let data = await response.json();
        message.classList.remove('d-none');
        message.classList.remove('alert-primary');

        if(data.type == 'success'){
            message.classList.add('alert-success');
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            setTimeout(function() {
                window.location.href = "crypto";
            }, 1500); // 1,5s
        }else{
            message.classList.add('alert-danger');
        }
        contentMessage.textContent = `Resposta: ${data.message}`; 
        loginButton.classList.remove('d-none');
    } catch (error) {
        console.error("Falha ao enviar:", error);
        alert("Erro na requisição: " + error.message);
    }
}

// Função que valida os formulários
const checkForms = (email, password) => {
    let statusForm = true;

    // 1 - Verificando se os campos não estão vazios
    if (email === '' || password === '') {
        message.classList.remove('d-none');
        message.classList.remove('alert-primary');
        message.classList.add('alert-danger');
        contentMessage.textContent = `Preencha todos os campos.`; 
        return false; 
    }

    // Se passou nas verificações
    message.classList.add('d-none');
    return true;
}