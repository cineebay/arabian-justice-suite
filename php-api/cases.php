<?php
require_once 'config.php';

$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $conn->prepare("
                SELECT c.*, cl.name as client_name 
                FROM cases c 
                LEFT JOIN clients cl ON c.client_id = cl.id 
                WHERE c.id = ?
            ");
            $stmt->bind_param("s", $id);
            $stmt->execute();
            $case = $stmt->get_result()->fetch_assoc();
            
            if ($case) {
                // Get timeline
                $stmt2 = $conn->prepare("SELECT * FROM case_timeline WHERE case_id = ? ORDER BY date DESC");
                $stmt2->bind_param("s", $id);
                $stmt2->execute();
                $timeline = [];
                while ($row = $stmt2->get_result()->fetch_assoc()) {
                    $timeline[] = $row;
                }
                $case['timeline'] = $timeline;
                
                // Get files
                $stmt3 = $conn->prepare("SELECT * FROM case_files WHERE case_id = ? ORDER BY uploaded_at DESC");
                $stmt3->bind_param("s", $id);
                $stmt3->execute();
                $files = [];
                while ($row = $stmt3->get_result()->fetch_assoc()) {
                    $files[] = $row;
                }
                $case['files'] = $files;
            }
            
            jsonResponse($case ?: ['error' => 'Case not found'], $case ? 200 : 404);
        } else {
            $result = $conn->query("
                SELECT c.*, cl.name as client_name 
                FROM cases c 
                LEFT JOIN clients cl ON c.client_id = cl.id 
                ORDER BY c.created_at DESC
            ");
            $cases = [];
            while ($row = $result->fetch_assoc()) {
                $cases[] = $row;
            }
            jsonResponse($cases);
        }
        break;

    case 'POST':
        $data = getJsonBody();
        $id = uniqid('case-');
        $caseNumber = 'QZ-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        
        $stmt = $conn->prepare("INSERT INTO cases (id, case_number, client_id, title, type, status, tribunal, description, next_session) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $status = $data['status'] ?? 'جديد';
        $stmt->bind_param("sssssssss", $id, $caseNumber, $data['client_id'], $data['title'], $data['type'], $status, $data['tribunal'], $data['description'], $data['next_session']);
        
        if ($stmt->execute()) {
            // Update client cases count
            if (!empty($data['client_id'])) {
                $conn->query("UPDATE clients SET cases_count = cases_count + 1 WHERE id = '{$data['client_id']}'");
            }
            
            // Add initial timeline entry
            $timelineId = uniqid('tl-');
            $stmt2 = $conn->prepare("INSERT INTO case_timeline (id, case_id, date, title, description) VALUES (?, ?, CURDATE(), 'فتح الملف', 'تم إنشاء الملف القضائي')");
            $stmt2->bind_param("ss", $timelineId, $id);
            $stmt2->execute();
            
            jsonResponse(['id' => $id, 'case_number' => $caseNumber, 'message' => 'Case created successfully'], 201);
        } else {
            jsonResponse(['error' => 'Failed to create case'], 500);
        }
        break;

    case 'PUT':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $data = getJsonBody();
        $stmt = $conn->prepare("UPDATE cases SET title=?, type=?, status=?, tribunal=?, description=?, next_session=?, client_id=? WHERE id=?");
        $stmt->bind_param("ssssssss", $data['title'], $data['type'], $data['status'], $data['tribunal'], $data['description'], $data['next_session'], $data['client_id'], $id);
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Case updated successfully']);
        } else {
            jsonResponse(['error' => 'Failed to update case'], 500);
        }
        break;

    case 'DELETE':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $stmt = $conn->prepare("DELETE FROM cases WHERE id = ?");
        $stmt->bind_param("s", $id);
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Case deleted successfully']);
        } else {
            jsonResponse(['error' => 'Failed to delete case'], 500);
        }
        break;
}

$conn->close();
?>
