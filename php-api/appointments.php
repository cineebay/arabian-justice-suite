<?php
require_once 'config.php';

$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM appointments WHERE id = ?");
            $stmt->bind_param("s", $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            jsonResponse($result ?: ['error' => 'Appointment not found'], $result ? 200 : 404);
        } else {
            $result = $conn->query("SELECT * FROM appointments ORDER BY date DESC, time DESC");
            $appointments = [];
            while ($row = $result->fetch_assoc()) {
                $appointments[] = $row;
            }
            jsonResponse($appointments);
        }
        break;

    case 'POST':
        $data = getJsonBody();
        $id = uniqid('apt-');
        $stmt = $conn->prepare("INSERT INTO appointments (id, client_id, client_name, service, date, time, status, notes, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $status = $data['status'] ?? 'pending';
        $stmt->bind_param("ssssssssss", $id, $data['client_id'], $data['client_name'], $data['service'], $data['date'], $data['time'], $status, $data['notes'], $data['phone'], $data['email']);
        if ($stmt->execute()) {
            // Update client appointments count
            if (!empty($data['client_id'])) {
                $conn->query("UPDATE clients SET appointments_count = appointments_count + 1 WHERE id = '{$data['client_id']}'");
            }
            jsonResponse(['id' => $id, 'message' => 'Appointment created successfully'], 201);
        } else {
            jsonResponse(['error' => 'Failed to create appointment'], 500);
        }
        break;

    case 'PUT':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $data = getJsonBody();
        $stmt = $conn->prepare("UPDATE appointments SET client_name=?, service=?, date=?, time=?, status=?, notes=?, phone=?, email=? WHERE id=?");
        $stmt->bind_param("sssssssss", $data['client_name'], $data['service'], $data['date'], $data['time'], $data['status'], $data['notes'], $data['phone'], $data['email'], $id);
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Appointment updated successfully']);
        } else {
            jsonResponse(['error' => 'Failed to update appointment'], 500);
        }
        break;

    case 'DELETE':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $stmt = $conn->prepare("DELETE FROM appointments WHERE id = ?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Appointment deleted successfully']);
        } else {
            jsonResponse(['error' => 'Failed to delete appointment'], 500);
        }
        break;
}

$conn->close();
?>
