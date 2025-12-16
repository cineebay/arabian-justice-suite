<?php
require_once 'config.php';

$conn = getConnection();

// Create uploads directory if not exists
$uploadDir = 'uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $caseId = $_POST['case_id'] ?? null;
    
    if (!$caseId) {
        jsonResponse(['error' => 'case_id is required'], 400);
    }
    
    if (!isset($_FILES['file'])) {
        jsonResponse(['error' => 'No file uploaded'], 400);
    }
    
    $file = $_FILES['file'];
    $originalName = $file['name'];
    $fileType = $file['type'];
    $fileSize = $file['size'];
    
    // Generate unique filename
    $extension = pathinfo($originalName, PATHINFO_EXTENSION);
    $filename = uniqid('file-') . '.' . $extension;
    $filePath = $uploadDir . $filename;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        $id = uniqid('cf-');
        $stmt = $conn->prepare("INSERT INTO case_files (id, case_id, filename, original_name, file_path, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssi", $id, $caseId, $filename, $originalName, $filePath, $fileType, $fileSize);
        
        if ($stmt->execute()) {
            jsonResponse([
                'id' => $id,
                'filename' => $filename,
                'original_name' => $originalName,
                'file_path' => $filePath,
                'message' => 'File uploaded successfully'
            ], 201);
        } else {
            unlink($filePath); // Delete file if DB insert fails
            jsonResponse(['error' => 'Failed to save file info'], 500);
        }
    } else {
        jsonResponse(['error' => 'Failed to upload file'], 500);
    }
}

// GET - List files for a case
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $caseId = $_GET['case_id'] ?? null;
    
    if ($caseId) {
        $stmt = $conn->prepare("SELECT * FROM case_files WHERE case_id = ? ORDER BY uploaded_at DESC");
        $stmt->bind_param("s", $caseId);
        $stmt->execute();
        $result = $stmt->get_result();
        $files = [];
        while ($row = $result->fetch_assoc()) {
            $files[] = $row;
        }
        jsonResponse($files);
    } else {
        jsonResponse(['error' => 'case_id is required'], 400);
    }
}

// DELETE - Remove a file
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;
    
    if (!$id) jsonResponse(['error' => 'ID required'], 400);
    
    // Get file path first
    $stmt = $conn->prepare("SELECT file_path FROM case_files WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    
    if ($result && file_exists($result['file_path'])) {
        unlink($result['file_path']);
    }
    
    $stmt = $conn->prepare("DELETE FROM case_files WHERE id = ?");
    $stmt->bind_param("s", $id);
    if ($stmt->execute()) {
        jsonResponse(['message' => 'File deleted successfully']);
    } else {
        jsonResponse(['error' => 'Failed to delete file'], 500);
    }
}

$conn->close();
?>
