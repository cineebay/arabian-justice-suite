<?php
require_once 'config.php';

$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM services WHERE id = ?");
            $stmt->bind_param("s", $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            jsonResponse($result ?: ['error' => 'Service not found'], $result ? 200 : 404);
        } else {
            $result = $conn->query("SELECT * FROM services ORDER BY created_at ASC");
            $services = [];
            while ($row = $result->fetch_assoc()) {
                $services[] = $row;
            }
            jsonResponse($services);
        }
        break;

    case 'POST':
        $data = getJsonBody();
        $id = uniqid('svc-');
        $stmt = $conn->prepare("INSERT INTO services (id, name, description, icon, price) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssd", $id, $data['name'], $data['description'], $data['icon'], $data['price']);
        if ($stmt->execute()) {
            jsonResponse(['id' => $id, 'message' => 'Service created successfully'], 201);
        } else {
            jsonResponse(['error' => 'Failed to create service'], 500);
        }
        break;

    case 'PUT':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $data = getJsonBody();
        $stmt = $conn->prepare("UPDATE services SET name=?, description=?, icon=?, price=? WHERE id=?");
        $stmt->bind_param("sssds", $data['name'], $data['description'], $data['icon'], $data['price'], $id);
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Service updated successfully']);
        } else {
            jsonResponse(['error' => 'Failed to update service'], 500);
        }
        break;

    case 'DELETE':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $stmt = $conn->prepare("DELETE FROM services WHERE id = ?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Service deleted successfully']);
        } else {
            jsonResponse(['error' => 'Failed to delete service'], 500);
        }
        break;
}

$conn->close();
?>
