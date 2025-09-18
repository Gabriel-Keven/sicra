<?php

namespace App\Models;
use CodeIgniter\Model;

class LoginModel extends Model{
   
    protected $table      = 'users';
    protected $primaryKey = 'id';

     protected $allowedFields = [
        'last_login'
     ];

     public function login($email,$password){{
            return $this->asArray()
            ->where([
                    'email'=>$email,
                    'password_hash'=>md5($password)
            ])->first();
        }
    }
}

?>