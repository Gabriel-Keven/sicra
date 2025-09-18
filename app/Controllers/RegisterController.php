<?php

namespace App\Controllers;
use  \App\Models\RegisterModel;

class RegisterController extends BaseController
{
    public function index(): string
    {
        return view('RegisterView');
    }

    public function createUser()
    {
        //Dados do formulário
        $user = $this->request->getJSON(true); //Conversão do JSON para array
        $name = $user['name'];
        $email = $user['email'];
        $password = $user['password'];
        $confirmPassword = $user['confirmPassword'];

        // Verificações de campos obrigatórios
        $validationErrors = $this->validateFields($name,$email,$password,$confirmPassword);
        if ($validationErrors) {
            //Retorno do erro de validação do formulário
            return $this->response->setJSON([
                'type' => $validationErrors['type'],
                'message' => $validationErrors['message']
            ]);
        }
        
        // Cadastrar usuário
        $model = new RegisterModel();
        $resultInsert = $model->save([
            'name' => $name,
            'email' => $email,
            'password_hash' =>md5($password)
        ]);
        
        //Se houver erro na inserção do banco de dados
        $errors = $model->errors();
        if(sizeof($errors)>0){
            $message = "";
            foreach ($errors as $error) {
                $message.=" ".$error;
            }

            return $this->response->setJSON([
                'type' => 'error',
                'message' => $message
            ]);
        }

        if ($resultInsert) {
            return $this->response->setJSON([
                'type' => 'success',
                'message' => 'Cadastro realizado.'
            ]);
           
        }else{
            return $this->response->setJSON([
                    'type' => 'error',
                    'message' => 'Cadastro não realizado! Falha na inserção da inscrição no banco de dados.'
                ]);
            }
    }

    public function validateFields()
    {
        // Definindo as regras de validação
        $validationRules = [
            'name'           => 'required|min_length[3]',
            'email'          => 'required|valid_email',
            'password'       => 'required|min_length[4]',
            'confirmPassword'=> 'required|matches[password]'
        ];

        // Mensagens personalizadas para cada campo
        $validationMessages = [
            'name' => [
                'required'    => 'O nome é obrigatório.',
                'min_length'  => 'O nome deve ter pelo menos 3 caracteres.',
            ],
            'email' => [
                'required'    => 'O e-mail é obrigatório.',
                'valid_email' => 'O e-mail informado é inválido.',
            ],
            'password' => [
                'required'    => 'A senha é obrigatória.',
                'min_length'  => 'A senha deve ter pelo menos 4 caracteres.',
            ],
            'confirmPassword' => [
                'required'    => 'A confirmação de senha é obrigatória.',
                'matches'     => 'A confirmação de senha não corresponde.',
            ]
        ];

        // Aplica a validação
        if (!$this->validate($validationRules, $validationMessages)) {
            return [
                'type' => 'error',
                'message' => 'Validação do formulário falhou. '. implode(' ', $this->validator->getErrors())
            ];
            
        }
        return null; // Retorna null se a validação passar
    }
}
