// Alerta para mensagens
const message = document.getElementById('message');
const contentMessage = document.getElementById('contentMessage');

// Botão que envia o formulário
const buttonUpdate = document.getElementById('buttonUpdate');

// Obter os valores do formulário e remover espaços extras
getDateUser();

// Interromper funcionamento padrão do botão
buttonUpdate.addEventListener('click', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Status do formulário após verificações
    const statusFormChecked = checkForms(name, email);
 
    
    if (statusFormChecked === true) {
        const user = {
            name: name,
            email: email,
            password: password
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
        let response = await fetch("updateUser", {
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
            document.getElementById('password').value = '';
        }else{
            message.classList.add('alert-danger');
        }
        contentMessage.textContent = `Resposta: ${data.message}`; 
        buttonUpdate.classList.remove('d-none');
    } catch (error) {
        console.error("Falha ao enviar:", error);
        alert("Erro na requisição: " + error.message);
    }
}

// Função que valida os formulários
const checkForms = (name, email) => {
    let statusForm = true;

    // 1 - Verificando se os campos não estão vazios
    if (name === '' || email === '') {
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

// Função que obtém os dados do usuário
async function getDateUser() {
    try {
        let response = await fetch("getDateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            }
        });

        if (!response.ok) {
            throw new Error("Erro HTTP: " + response.status);
        }

        let data = await response.json();
        // Adiciona uma option para cada usuário
        data.user.forEach(user => {
        // Você pode usar o que quiser como "value". Aqui, estou usando o email
        document.getElementById('name').value =  user.name;
        document.getElementById('email').value =  user.email;

        });
        if(data.type == 'success'){
            message.classList.add('alert-success');
        }else{
            message.classList.add('alert-danger');
        }
        contentMessage.textContent = `Resposta: ${data.message}`; 
        buttonUpdate.classList.remove('d-none');
    } catch (error) {
        console.error("Falha ao enviar:", error);
        alert("Erro na requisição: " + error.message);
    }
}