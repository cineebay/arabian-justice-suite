<?php
require_once 'config.php';

$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM clients WHERE id = ?");
            $stmt->bind_param("s", $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            jsonResponse($result ?: ['error' => 'Client not found'], $result ? 200 : 404);
        } else {
            $result = $conn->query("SELECT * FROM clients ORDER BY created_at DESC");
            $clients = [];
            while ($row = $result->fetch_assoc()) {
                $clients[] = $row;
            }
            jsonResponse($clients);
        }
        break;

    case 'POST':
        $data = getJsonBody();
        $id = uniqid('cli-');
        $stmt = $conn->prepare("INSERT INTO clients (id, name, email, phone, address, cin) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $id, $data['name'], $data['email'], $data['phone'], $data['address'], $data['cin']);
        if ($stmt->execute()) {
            jsonResponse(['id' => $id, 'message' => 'Client created successfully'], 201);
        } else {
            jsonResponse(['error' => 'Failed to create client'], 500);
        }
        break;

    case 'PUT':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $data = getJsonBody();
        $stmt = $conn->prepare("UPDATE clients SET name=?, email=?, phone=?, address=?, cin=? WHERE id=?");
        $stmt->bind_param("ssssss", $data['name'], $data['email'], $data['phone'], $data['address'], $data['cin'], $id);
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Client updated successfully']);
        } else {
            jsonResponse(['error' => 'Failed to update client'], 500);
        }
        break;

    case 'DELETE':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $stmt = $conn->prepare("DELETE FROM clients WHERE id = ?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Client deleted successfully']);
        } else {
            jsonResponse(['error' => 'Failed to delete client'], 500);
        }
        break;
}

$conn->close();
?>
