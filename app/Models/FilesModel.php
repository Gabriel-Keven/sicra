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

      public function searchCryptedFiles($userId){
        $sql = "SELECT f.id as upload_id, f.sender_id,
        u.name as name_sender, f.filename, f.uploaded_at, f.file_path
                FROM users as u, files as f
                WHERE f.recipient_id = $userId 
                AND u.id = f.sender_id";
        $query = $this->db->query($sql);
        return $query->getResultArray();
    }
}
?>