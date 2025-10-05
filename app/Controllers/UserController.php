<?php
namespace App\Controllers;
use  \App\Models\UserModel;

class UserController extends BaseController
{
    public function index()
    {
        $session = \Config\Services::session();
		if($session->get('logged_in') === NULL ){
            echo view('LoginView');
		}else{
			echo view('UserView');
		}
    }

     public function updateUser()
    {
        //Dados do formulário
        $user = $this->request->getJSON(true); //Conversão do JSON para array
        $name = $user['name'];
        $email = $user['email'];
        $password = $user['password'];

        // Verificações de campos obrigatórios
        $validationErrors = $this->validateFields($name,$email);
        if ($validationErrors) {
            //Retorno do erro de validação do formulário
            return $this->response->setJSON([
                'type' => $validationErrors['type'],
                'message' => $validationErrors['message']
            ]);
        }
        
        // Alterar usuário
        $model = new UserModel();
        if($password === "" ||  $password=== NULL){
            $resultInsert = $model->save([
            'id' => $id,
            'name' => $name,
            'email' => $email
        ]);
        
        }else{
             $resultInsert = $model->save([
            'id' => $id,
            'name' => $name,
            'email' => $email,
            'password_hash' =>md5($password)
        ]);
        
        }
        
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
                'message' => 'Cadastro atualizado.'
            ]);
           
        }else{
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Cadastro não atualizado.'
            ]);
        }
    }
    
    public function validateFields()
    {
        // Definindo as regras de validação
        $validationRules = [
            'name'           => 'required|min_length[3]',
            'email'          => 'required|valid_email'
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
  public function getDateUser(){
         //Obter dados da sessão
        $session = \Config\Services::session();
        if($session->get('logged_in') === NULL ){
           return redirect()->to('/login');
		}
        $userId = $session->get()['id'];
        $model = new UserModel();
        $user = $model->getUserData($userId);
        if (sizeof($user) == 0) {
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Não foi possível obter os dados dos usuários.'
            ]);
        }else{
            return $this->response->setJSON([
                    'type' => 'success',
                    'message' => 'Dados recuperados com sucesso.',
                    'user' =>$user
                ]);
            }
    }
}
