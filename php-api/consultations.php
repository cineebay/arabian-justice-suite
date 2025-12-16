<?php
require_once 'config.php';

$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM consultations WHERE id = ?");
            $stmt->bind_param("s", $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            jsonResponse($result ?: ['error' => 'Consultation not found'], $result ? 200 : 404);
        } else {
            $result = $conn->query("SELECT * FROM consultations ORDER BY created_at DESC");
            $consultations = [];
            while ($row = $result->fetch_assoc()) {
                $consultations[] = $row;
            }
            jsonResponse($consultations);
        }
        break;

    case 'POST':
        $data = getJsonBody();
        $id = uniqid('cons-');
        $stmt = $conn->prepare("INSERT INTO consultations (id, client_name, phone, email, type, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $status = $data['status'] ?? 'pending';
        $stmt->bind_param("sssssss", $id, $data['client_name'], $data['phone'], $data['email'], $data['type'], $data['description'], $status);
        if ($stmt->execute()) {
            jsonResponse(['id' => $id, 'message' => 'Consultation created successfully'], 201);
        } else {
            jsonResponse(['error' => 'Failed to create consultation'], 500);
        }
        break;

    case 'PUT':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $data = getJsonBody();
        $stmt = $conn->prepare("UPDATE consultations SET client_name=?, phone=?, email=?, type=?, description=?, status=?, reply=? WHERE id=?");
        $stmt->bind_param("ssssssss", $data['client_name'], $data['phone'], $data['email'], $data['type'], $data['description'], $data['status'], $data['reply'], $id);
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Consultation updated successfully']);
        } else {
            jsonResponse(['error' => 'Failed to update consultation'], 500);
        }
        break;

    case 'DELETE':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $stmt = $conn->prepare("DELETE FROM consultations WHERE id = ?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Consultation deleted successfully']);
        } else {
            jsonResponse(['error' => 'Failed to delete consultation'], 500);
        }
        break;
}

$conn->close();
?>
