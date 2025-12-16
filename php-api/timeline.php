<?php
require_once 'config.php';

$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$caseId = $_GET['case_id'] ?? null;

switch ($method) {
    case 'GET':
        if (!$caseId) jsonResponse(['error' => 'case_id is required'], 400);
        $stmt = $conn->prepare("SELECT * FROM case_timeline WHERE case_id = ? ORDER BY date DESC");
        $stmt->bind_param("s", $caseId);
        $stmt->execute();
        $result = $stmt->get_result();
        $timeline = [];
        while ($row = $result->fetch_assoc()) {
            $timeline[] = $row;
        }
        jsonResponse($timeline);
        break;

    case 'POST':
        $data = getJsonBody();
        if (!$data['case_id']) jsonResponse(['error' => 'case_id is required'], 400);
        
        $id = uniqid('tl-');
        $stmt = $conn->prepare("INSERT INTO case_timeline (id, case_id, date, title, description) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $id, $data['case_id'], $data['date'], $data['title'], $data['description']);
        if ($stmt->execute()) {
            jsonResponse(['id' => $id, 'message' => 'Timeline entry added successfully'], 201);
        } else {
            jsonResponse(['error' => 'Failed to add timeline entry'], 500);
        }
        break;

    case 'DELETE':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $stmt = $conn->prepare("DELETE FROM case_timeline WHERE id = ?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Timeline entry deleted successfully']);
        } else {
            jsonResponse(['error' => 'Failed to delete timeline entry'], 500);
        }
        break;
}

$conn->close();
?>
