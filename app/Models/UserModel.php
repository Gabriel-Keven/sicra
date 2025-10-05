<?php

namespace App\Models;
use CodeIgniter\Model;

class UserModel extends Model
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



    public function searchUsersHavePublicKey($userId){
        $sql = "SELECT id, name, email, public_key
        FROM users
        WHERE public_key IS NOT NULL
        AND public_key != ''
        AND id <> $userId";
        $query = $this->db->query($sql);
        return $query->getResultArray();
    }
}
?>