<?php
require_once 'config.php';

$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM notifications WHERE id = ?");
            $stmt->bind_param("s", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                jsonResponse($row);
            } else {
                jsonResponse(['error' => 'Notification not found'], 404);
            }
        } else {
            $result = $conn->query("SELECT * FROM notifications ORDER BY created_at DESC");
            $notifications = [];
            while ($row = $result->fetch_assoc()) {
                $notifications[] = $row;
            }
            jsonResponse($notifications);
        }
        break;

    case 'POST':
        $data = getJsonBody();
        $id = uniqid('notif-');
        $stmt = $conn->prepare("INSERT INTO notifications (id, title, message, type, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())");
        $stmt->bind_param("ssss", $id, $data['title'], $data['message'], $data['type']);
        if ($stmt->execute()) {
            jsonResponse(['id' => $id, 'message' => 'Notification created successfully'], 201);
        } else {
            jsonResponse(['error' => 'Failed to create notification'], 500);
        }
        break;

    case 'PUT':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $data = getJsonBody();
        
        // Check if marking all as read
        if (isset($_GET['action']) && $_GET['action'] === 'mark_all_read') {
            if ($conn->query("UPDATE notifications SET is_read = 1")) {
                jsonResponse(['message' => 'All notifications marked as read']);
            } else {
                jsonResponse(['error' => 'Failed to update notifications'], 500);
            }
            break;
        }
        
        $stmt = $conn->prepare("UPDATE notifications SET is_read = ? WHERE id = ?");
        $isRead = $data['is_read'] ? 1 : 0;
        $stmt->bind_param("is", $isRead, $id);
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Notification updated successfully']);
        } else {
            jsonResponse(['error' => 'Failed to update notification'], 500);
        }
        break;

    case 'DELETE':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $stmt = $conn->prepare("DELETE FROM notifications WHERE id = ?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Notification deleted successfully']);
        } else {
            jsonResponse(['error' => 'Failed to delete notification'], 500);
        }
        break;
}

$conn->close();
?>
