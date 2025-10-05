<?php

namespace App\Controllers;
use  \App\Models\UserModel;

class CryptoController extends BaseController
{
    public function index(){
        $session = \Config\Services::session();
		if($session->get('logged_in') === NULL ){
            echo view('LoginView');
		}else{
			echo view('CryptoView');
		}
    }

    public function insertPublicKey(){
         //Obter dados da sessão
        $session = \Config\Services::session();
        if($session->get('logged_in') === NULL ){
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Falha ao obter os dados da sessão.'
            ]);
		}

        //Dados do formulário
        $publicKey = $this->request->getJSON(true); //Conversão do JSON para array

        if($publicKey === ""){
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'A chave pública está vazia.'
            ]);
        }

        //Limpando a chave pública
        $cleanPublicKey = str_replace(
        ["-----BEGIN PUBLIC KEY-----", "-----END PUBLIC KEY-----", "\n", "\r"],
        "",
        $publicKey
        );

        // Cadastrar usuário
        $model = new UserModel();
        $resultInsert = $model->save([
            'id' => $session->get()['id'],
            'public_key' => $cleanPublicKey,
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
                'message' => 'Chave Pública cadastrada com sucesso no banco de dados.'
            ]);
           
        }else{
            return $this->response->setJSON([
                    'type' => 'error',
                    'message' => 'Chave pública não cadastrada no banco de dados.'
                ]);
            }
    }

    public function deletePublicKey(){
         //Obter dados da sessão
        $session = \Config\Services::session();
        if($session->get('logged_in') === NULL ){
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Falha ao obter os dados da sessão.'
            ]);
		}

        // Cadastrar usuário
        $model = new UserModel();
        $resultInsert = $model->save([
            'id' => $session->get()['id'],
            'public_key' => "",
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
                'message' => 'Chave Pública excluída com sucesso no banco de dados.'
            ]);
           
        }else{
            return $this->response->setJSON([
                    'type' => 'error',
                    'message' => 'Chave pública não excluída no banco de dados.'
                ]);
            }
    }

    public function checkPairOfKeysIsCreated(){
         //Obter dados da sessão
        $session = \Config\Services::session();
        if($session->get('logged_in') === NULL ){
           return redirect()->to('/login');
		}

        $model = new UserModel();
        $resultSelect = $model
                            ->select('public_key')
                            ->where('id', $session->get()['id'])
                            ->first();
        // Se o returnType do model for array
        $publicKey = $resultSelect['public_key'];
        
        if ($publicKey === NULL || $publicKey === "") {
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Primeiro acesso para gerar o par de chaves.'
            ]);
        }else{
            return $this->response->setJSON([
                    'type' => 'success',
                    'message' => 'Novo acesso para gerar outro par de chaves.',
                    'publicKey' =>$publicKey
                ]);
            }
    }
    public function searchUsersHavePublicKey(){
         //Obter dados da sessão
        $session = \Config\Services::session();
        if($session->get('logged_in') === NULL ){
           return redirect()->to('/login');
		}
        $userId = $session->get()['id'];
        $model = new UserModel();
        $users = $model->searchUsersHavePublicKey($userId);
        
        if (sizeof($users) == 0) {
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Não foram encontrados usuários com chave pública cadastrada.'
            ]);
        }else{
            return $this->response->setJSON([
                    'type' => 'success',
                    'message' => 'Usuários com chave pública cadastraddos.',
                    'users' =>$users
                ]);
            }
    }
    public function sendFileCrypted(){
        //Obter dados da sessão
        $session = \Config\Services::session();
        if($session->get('logged_in') === NULL ){
           return redirect()->to('/login');
		}
        //Texto criptografado
        $textEncrypted = $this->request->getJSON(true); //Conversão do JSON para array

        
        
    }

}
