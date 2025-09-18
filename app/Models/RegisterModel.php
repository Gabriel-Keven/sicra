<?php

namespace App\Models;
use CodeIgniter\Model;

class RegisterModel extends Model
{
    
    protected $table      = 'users';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'created_at',
        'updated_at',
        'name',
        'email',
        'password_hash',
        'public_key',
        'private_key_encrypted',
    ];

        protected $useSoftDelete = true;
        protected $useTimestamps = true;
        protected $dataFormat = 'datetime';
        protected $createField = 'created_at';
        protected $updateField = 'updated_at';

}



?>