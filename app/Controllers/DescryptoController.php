<?php

namespace App\Controllers;
use  \App\Models\UserModel;
use \App\Models\FilesModel;

class DescryptoController extends BaseController
{
    public function index(){
        $session = \Config\Services::session();
		if($session->get('logged_in') === NULL ){
            echo view('LoginView');
		}else{
			echo view('DescryptoView');
		}
    }

     public function searchCryptedFiles(){
         //Obter dados da sessão
        $session = \Config\Services::session();
        if($session->get('logged_in') === NULL ){
           return redirect()->to('/login');
		}
        $userId = $session->get()['id'];
        $model = new FilesModel();
        $files = $model->searchCryptedFiles($userId);
        //Formatar aqui a data para o formato não americano
        
        if(sizeof($files) == 0) {
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Não foram encontrados arquivos para download.',
                'files' =>$files
            ]);
        }else{
            return $this->response->setJSON([
                    'type' => 'success',
                    'message' => 'Arquivos para download encontrados.',
                    'files' =>$files
                ]);
            }
    }

     public function getEncryptedFile(){
         //Obter dados da sessão
        $session = \Config\Services::session();
        if($session->get('logged_in') === NULL ){
           return redirect()->to('/login');
		}

        $request = $this->request->getJSON(true); // Pega JSON vindo via POST

        $fileNameSelected = $request['fileNameSelected'] ?? null;
        $filePathSelected = $request['filePathSelected'] ?? null;
        $uploadFileId = $request['uploadFileId'] ?? null;

        if (!$filePathSelected || !$uploadFileId ||!$fileNameSelected) {
            return $this->response->setJSON([
                'type' => 'erro',
                'message' => 'Propriedades do arquivo não fornecidas.',
            ]);
        }
        if (!file_exists($filePathSelected)) {
            return $this->response->setJSON([
                'type' => 'erro',
                'message' => 'Arquivo não encontrado.',
            ]);
        }

        // Lê o conteúdo do arquivo criptografado (em blocos RSA criptografados em Base64)
        $fileContent = file_get_contents($filePathSelected.$fileNameSelected.".enc");

        // Supondo que os blocos foram salvos em Base64 e separados por nova linha
        $encryptedBlocks = array_filter(array_map('trim', explode("\n", $fileContent)));

        if(!$encryptedBlocks){
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Não foram encontrados os blocos para realizar a descriptografia.',
                'encryptedBlocks' =>$encryptedBlocks
            ]);
        }else{

            return $this->response->setJSON([
                'type' => 'success',
                'message' => 'Blocos criptografados obtidos com sucesso.',
                'encryptedBlocks' => $encryptedBlocks,
            ]);
        }
    
    }
}
