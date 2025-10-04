<?php

namespace App\Models;
use CodeIgniter\Model;

class RegisterModel extends Model
{
    
    protected $table      = 'files';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'id',
        'sender_id',
        'recipient_id',
        'filename',
        'file_path',
        'encrypted_aes_key',
        'uploaded_at',
    ];

}
?>