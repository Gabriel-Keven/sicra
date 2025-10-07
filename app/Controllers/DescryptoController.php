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

}
