<?php
require_once 'config.php';

$conn = getConnection();

$stats = [];

// Total cases
$result = $conn->query("SELECT COUNT(*) as count FROM cases");
$stats['totalCases'] = $result->fetch_assoc()['count'];

// Total clients
$result = $conn->query("SELECT COUNT(*) as count FROM clients");
$stats['totalClients'] = $result->fetch_assoc()['count'];

// Total appointments
$result = $conn->query("SELECT COUNT(*) as count FROM appointments");
$stats['totalAppointments'] = $result->fetch_assoc()['count'];

// Pending appointments
$result = $conn->query("SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'");
$stats['pendingAppointments'] = $result->fetch_assoc()['count'];

// Total consultations
$result = $conn->query("SELECT COUNT(*) as count FROM consultations");
$stats['totalConsultations'] = $result->fetch_assoc()['count'];

// Pending consultations
$result = $conn->query("SELECT COUNT(*) as count FROM consultations WHERE status = 'pending'");
$stats['pendingConsultations'] = $result->fetch_assoc()['count'];

// Active cases
$result = $conn->query("SELECT COUNT(*) as count FROM cases WHERE status != 'مغلق'");
$stats['activeCases'] = $result->fetch_assoc()['count'];

// Cases by type
$result = $conn->query("SELECT type, COUNT(*) as count FROM cases GROUP BY type");
$casesByType = [];
while ($row = $result->fetch_assoc()) {
    $casesByType[] = $row;
}
$stats['casesByType'] = $casesByType;

// Appointments by month (last 6 months)
$result = $conn->query("
    SELECT DATE_FORMAT(date, '%Y-%m') as month, COUNT(*) as count 
    FROM appointments 
    WHERE date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(date, '%Y-%m')
    ORDER BY month ASC
");
$appointmentsByMonth = [];
while ($row = $result->fetch_assoc()) {
    $appointmentsByMonth[] = $row;
}
$stats['appointmentsByMonth'] = $appointmentsByMonth;

// Recent appointments
$result = $conn->query("SELECT * FROM appointments ORDER BY created_at DESC LIMIT 5");
$recentAppointments = [];
while ($row = $result->fetch_assoc()) {
    $recentAppointments[] = $row;
}
$stats['recentAppointments'] = $recentAppointments;

jsonResponse($stats);

$conn->close();
?>
