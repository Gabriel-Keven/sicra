<?php

namespace App\Controllers;
use  \App\Models\LoginModel;
class LoginController extends BaseController{
	public function index(){
		echo view('LoginView');
	}
	
	public function login(){
        setlocale(LC_ALL, 'pt_BR.UTF-8');
		$user = $this->request->getJSON(true); //Conversão do JSON para array
        $email = $user['email'];
        $password = $user['password'];

        // Verificações de campos obrigatórios
        $validationErrors = $this->validateFields($email,$password);
        if ($validationErrors) {
            //Retorno do erro de validação do formulário
            return $this->response->setJSON([
                'type' => $validationErrors['type'],
                'message' => $validationErrors['message']
            ]);
        }

        $model = new LoginModel();
		$user = $model->login($email ,$password);

		//Se houver erro no login do banco de dados
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

        if($user === NULL || $user === ''){
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Login não realizado. Usuário não encontrado ou erros nas credenciais.'
            ]);
        }
        
		// Gravar a data e hora do último login
		$model = new LoginModel();
		$resultInserDateLogin = $model->save([
            	'id'=>$user['id'],
            	'last_login'=>date('Y-m-d H:i:s')
            ]);
        
        if($resultInserDateLogin === NULL || $resultInserDateLogin === ''){
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Login não realizado. Porém, data de login não inserida no banco de dados.'
            ]);
        }

        //Criação da sessão
        $session = \Config\Services::session();
        $session->set($user);
        $id = $user['id'];
        $data = [
            'logged_in' => TRUE	
        ];
        $session->set($data);

        if($session->get('logged_in') === FALSE) {
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Falha ao inserir as informações na sessão. Tente novamente.'
            ]);
        }

        return $this->response->setJSON([
            'type' => 'success',
            'message' => 'Login realizado com sucesso. Você será redirecionado...'
        ]);
	}

	public function logout(){
		$data['session'] = \Config\Services::session();
		$data['session']->destroy();
		return redirect()->to('/login');
	}

	  public function validateFields()
    {
        // Definindo as regras de validação
        $validationRules = [
            'email'          => 'required|valid_email',
            'password'       => 'required|min_length[4]'
        ];

        // Mensagens personalizadas para cada campo
        $validationMessages = [
            'email' => [
                'required'    => 'O e-mail é obrigatório.',
                'valid_email' => 'O e-mail informado é inválido.',
            ],
            'password' => [
                'required'    => 'A senha é obrigatória.',
                'min_length'  => 'A senha deve ter pelo menos 4 caracteres.',
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
?>

