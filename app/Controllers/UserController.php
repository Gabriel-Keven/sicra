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

 
}
