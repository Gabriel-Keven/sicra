<?php

namespace App\Models;
use CodeIgniter\Model;

class FilesModel extends Model
{
    
    protected $table      = 'files';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'id',
        'sender_id',
        'recipient_id',
        'filename',
        'file_path',
        'uploaded_at',
    ];

}
?>