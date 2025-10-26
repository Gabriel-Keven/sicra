<?php

namespace App\Controllers;
use \App\Models\UserModel;
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
        
        // O model precisa buscar o nome do remetente (sender)
		$files = $model->searchCryptedFiles($userId);
        // Formatando a data conforme solicitado
		foreach ($files as &$file) {
            // O formato salvo foi 'Y-m-d_H-i-s'
			$dateObj = \DateTime::createFromFormat('Y-m-d_H-i-s', $file['uploaded_at']);
			if ($dateObj) {
                // Formata para o padrão brasileiro
				$file['uploaded_at_formatted'] = $dateObj->format('d/m/Y \à\s H:i:s');
			} else {
				$file['uploaded_at_formatted'] = $file['uploaded_at']; // fallback
		}
	}
	// unset para evitar problemas de referência
	unset($file);
	if(sizeof($files) == 0) {
		return $this->response->setJSON([
			'type' => 'error',
			'message' => 'Não foram encontrados arquivos para download.',
			'files' => $files // envia array vazio
		]);
	}else{
		return $this->response->setJSON([
			'type' => 'success',
			'message' => 'Arquivos para download encontrados.',
			'files' => $files
		]);
	}
 }


    public function downloadFile($fileId = null)
    {
        $session = \Config\Services::session();
        if (!$session->get('logged_in')) {
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Usuário não autenticado.'
            ], 401); // 401 Unauthorized
        }

        if (empty($fileId)) {
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'ID do arquivo não fornecido.'
            ], 400); // 400 Bad Request
        }

        $userId = (int) $session->get('id');
        $model = new FilesModel();

        //Buscar o arquivo no banco de dados
        $fileInfo = $model->find($fileId);

        if (!$fileInfo) {
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Arquivo não encontrado.'
            ], 404); // 404 Not Found
        }

        // Verificar permissão
        // Apenas o destinatário pode baixar o arquivo.
        if ((int) $fileInfo['recipient_id'] !== $userId) {
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Você não tem permissão para baixar este arquivo.'
            ], 403); // 403 Forbidden
        }

        // Localizar o arquivo JSON físico
        $fullPath = rtrim($fileInfo['file_path'], '/') . '/' . $fileInfo['filename'] . '.enc';

        if (!is_file($fullPath)) {
            log_message('error', 'Arquivo não encontrado no disco: ' . $fullPath);
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Erro interno: Arquivo não localizado no servidor.'
            ], 500);
        }

        // Ler o conteúdo do arquivo JSON
        $fileContent = file_get_contents($fullPath);
        if ($fileContent === false) {
            log_message('error', 'Falha ao ler o arquivo: ' . $fullPath);
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Erro interno: Falha ao ler o arquivo.'
            ], 500);
        }

        $jsonData = json_decode($fileContent, true);
        if ($jsonData === null) {
            log_message('error', 'Arquivo JSON inválido: ' . $fullPath);
            return $this->response->setJSON([
                'type' => 'error',
                'message' => 'Erro interno: O formato do arquivo está corrompido.'
            ], 500);
        }

        // Adiciona informações úteis para o frontend
        $jsonData['fileName'] = $fileInfo['filename'];
        $jsonData['fileType'] = $fileInfo['file_type'];
        
        return $this->response->setJSON($jsonData);
    }
}
