<?php

namespace App\Controllers;
use  \App\Models\UserModel;
use \App\Models\FilesModel;

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
    public function checkPublicKey(){
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
   
    public function sendFileCrypted() {
        $session = \Config\Services::session();

        if (!$session->get('logged_in')) {
            return redirect()->to('/login');
        }

        $data = $this->request->getJSON(true);

        $requiredFields = ['fileName', 'fileType', 'recipientId', 'encryptedKey', 'iv', 'encryptedFile'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                return $this->response->setJSON([
                    'type' => 'error',
                    'message' => "Dados incompletos. O campo '{$field}' está faltando."
                ]);
            }
        }

        $fileName = basename($data['fileName']);
        $fileType = $data['fileType']; // [NOVO]
        $recipientId = (int) $data['recipientId'];
        $senderId = (int) $session->get('id'); 
        $encryptedKey = $data['encryptedKey'];
        $iv = $data['iv'];
        $encryptedFile = $data['encryptedFile'];

        $dateFolder = date('Y-m-d_H-i-s'); 
        $folderPath = WRITEPATH . 'uploads/' . $dateFolder . '/' . $senderId . '_to_' . $recipientId . '/';

        if(!is_dir($folderPath)) {
            mkdir($folderPath, 0777, true);
        }
        
        $payload = [
            'encryptedKey' => $encryptedKey,
            'iv' => $iv,
            'encryptedFile' => $encryptedFile
        ];
        
        $fileContent = json_encode($payload);

        $fullPath = $folderPath . $fileName . '.enc';

        if (file_put_contents($fullPath, $fileContent) !== false) { 
            $model = new FilesModel();
            $resultInsert = $model->save([
            'sender_id' => $senderId,
            'recipient_id' => $recipientId,
            'filename' => $fileName, 
            'file_type' => $fileType, 
            'file_path' => $folderPath, 
            'uploaded_at' => $dateFolder
            ]);

            $errors = $model->errors();
            if(sizeof($errors)>0){
                $message = "";
            foreach ($errors as $error) {
                $message.=" ".$error;
            }

                // [IMPORTANTE] Se falhar o BD, deleta o arquivo salvo
                unlink($fullPath); 

                return $this->response->setJSON([
                    'type' => 'error',
                    'message' => $message
                ]);
            }

            if($resultInsert) {
                return $this->response->setJSON([
                    'type' => 'success',
                    'message' => 'Arquivo criptografado salvo com sucesso.']);
            } else {
                 // [IMPORTANTE] Se falhar o BD, deleta o arquivo salvo
                unlink($fullPath); 
            return $this->response->setJSON([
            'type' => 'error',
            'message' => 'Erro ao salvar as informações no banco de dados.'
            ]);
        }
        }else{
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Erro ao salvar o arquivo físico.'
            ]);
        }

    }
}