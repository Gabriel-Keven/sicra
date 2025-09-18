// Alerta para mensagens
const message = document.getElementById('message');
const contentMessage = document.getElementById('contentMessage');

// Botão que envia o formulário
const registerButton = document.getElementById('registerButton');

// Interromper funcionamento padrão do botão
registerButton.addEventListener('click', function(event) {
    event.preventDefault();
    // Obter os valores do formulário e remover espaços extras
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // Status do formulário após verificações
    const statusFormChecked = checkForms(name, email, password, confirmPassword);

    if (statusFormChecked === true) {
        const user = {
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        };

        // Chamar a função para enviar os dados
        sendUser(user);
    } else {
        // Não enviar dados para o controller
        console.log("Formulário inválido, não enviado.");
    }
});

// Função que envia os dados para o Controller
async function sendUser(user) {
    try {
        let response = await fetch("register", {
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
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('confirmPassword').value = '';
        }else{
            message.classList.add('alert-danger');
        }
        contentMessage.textContent = `Resposta: ${data.message}`; 
        registerButton.classList.remove('d-none');
    } catch (error) {
        console.error("Falha ao enviar:", error);
        alert("Erro na requisição: " + error.message);
    }
}

// Função que valida os formulários
const checkForms = (name, email, password, confirmPassword) => {
    let statusForm = true;

    // 1 - Verificando se os campos não estão vazios
    if (name === '' || email === '' || password === '' || confirmPassword === '') {
        message.classList.remove('d-none');
        message.classList.remove('alert-primary');
        message.classList.add('alert-danger');
        contentMessage.textContent = `Preencha todos os campos.`; 
        return false; 
    }

    // 2 - Verificando se as senhas coincidem
    if (password !== confirmPassword) {
        message.classList.remove('d-none');
        message.classList.remove('alert-primary');
        message.classList.add('alert-danger');
        contentMessage.textContent = `As senhas não coincidem.`; 
        return false;  
    }

    // Se passou nas verificações
    message.classList.add('d-none');
    return true;
}