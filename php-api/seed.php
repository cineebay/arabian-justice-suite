<?php
require_once 'config.php';

$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$action = $_GET['action'] ?? 'seed';

if ($action === 'clear') {
    // Clear all data
    $tables = ['notifications', 'case_timeline', 'case_files', 'consultations', 'appointments', 'cases', 'clients', 'services'];
    
    foreach ($tables as $table) {
        $conn->query("DELETE FROM $table");
    }
    
    jsonResponse(['message' => 'All data cleared successfully']);
} else {
    // Seed data
    
    // Clear existing data first
    $tables = ['notifications', 'case_timeline', 'case_files', 'consultations', 'appointments', 'cases', 'clients', 'services'];
    foreach ($tables as $table) {
        $conn->query("DELETE FROM $table");
    }
    
    // Insert Clients
    $clients = [
        ['cl-1', 'عبد الله أيت باها', '+212 661 234 567', 'abdellah.aitbaha@gmail.com', 'حي النخيل، زاكورة', 'JA123456', 2, 5],
        ['cl-2', 'خديجة الصحراوي', '+212 662 345 678', 'khadija.sahraoui@gmail.com', 'أمزرو، زاكورة', 'JA234567', 1, 3],
        ['cl-3', 'محمد أوعلي', '+212 663 456 789', 'mohamed.ouali@gmail.com', 'تازارين، زاكورة', 'JA345678', 3, 8],
        ['cl-4', 'فاطمة تامازيرت', '+212 664 567 890', 'fatima.tamazirt@gmail.com', 'أكدز، زاكورة', 'JA456789', 1, 2],
        ['cl-5', 'إبراهيم الدرعي', '+212 665 678 901', 'ibrahim.draoui@gmail.com', 'محاميد الغزلان، زاكورة', 'JA567890', 2, 4],
        ['cl-6', 'زينب أيت عيسى', '+212 666 789 012', 'zineb.aitissa@gmail.com', 'تنغير', 'JB678901', 1, 2],
    ];
    
    $stmt = $conn->prepare("INSERT INTO clients (id, name, phone, email, address, cin, cases_count, appointments_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    foreach ($clients as $c) {
        $stmt->bind_param("ssssssii", $c[0], $c[1], $c[2], $c[3], $c[4], $c[5], $c[6], $c[7]);
        $stmt->execute();
    }
    
    // Insert Services
    $services = [
        ['srv-1', 'القضايا الجنائية', 'الدفاع أمام محاكم الاستئناف والمحاكم الابتدائية في جميع القضايا الجنائية', 'scale'],
        ['srv-2', 'قضايا الأسرة', 'الطلاق، النفقة، الحضانة، تقسيم الممتلكات وفق مدونة الأسرة المغربية', 'users'],
        ['srv-3', 'القضايا التجارية', 'النزاعات التجارية، تأسيس الشركات، العقود التجارية، التحصيل', 'briefcase'],
        ['srv-4', 'القضايا العقارية', 'نزاعات الملكية، التحفيظ العقاري، عقود البيع والشراء، الإيجارات', 'building'],
        ['srv-5', 'قضايا الشغل', 'حقوق العمال، الفصل التعسفي، حوادث الشغل، التعويضات', 'hammer'],
        ['srv-6', 'الاستشارات القانونية', 'استشارات قانونية في جميع المجالات مع السرية التامة', 'message-circle'],
    ];
    
    $stmt = $conn->prepare("INSERT INTO services (id, title, description, icon) VALUES (?, ?, ?, ?)");
    foreach ($services as $s) {
        $stmt->bind_param("ssss", $s[0], $s[1], $s[2], $s[3]);
        $stmt->execute();
    }
    
    // Insert Appointments
    $appointments = [
        ['apt-1', 'cl-1', 'عبد الله أيت باها', 'استشارة قانونية', '2024-12-15', '10:00', 'confirmed', 'موعد لمناقشة قضية تجارية'],
        ['apt-2', 'cl-2', 'خديجة الصحراوي', 'قضية أسرة', '2024-12-16', '14:00', 'pending', 'ملف طلاق بالاتفاق'],
        ['apt-3', 'cl-3', 'محمد أوعلي', 'عقد تجاري', '2024-12-14', '11:30', 'completed', ''],
        ['apt-4', 'cl-4', 'فاطمة تامازيرت', 'قضية عقارية', '2024-12-17', '09:30', 'pending', ''],
        ['apt-5', 'cl-5', 'إبراهيم الدرعي', 'قضية شغل', '2024-12-18', '15:00', 'confirmed', 'فصل تعسفي - تعويضات'],
    ];
    
    $stmt = $conn->prepare("INSERT INTO appointments (id, client_id, client_name, service, date, time, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($appointments as $a) {
        $stmt->bind_param("ssssssss", $a[0], $a[1], $a[2], $a[3], $a[4], $a[5], $a[6], $a[7]);
        $stmt->execute();
    }
    
    // Insert Cases
    $cases = [
        ['case-1', 'ج/2024/1234', 'cl-1', 'عبد الله أيت باها', 'قضية تجارية', 'في المحكمة', 'نزاع تجاري حول عدم تنفيذ عقد توريد', 'المحكمة الابتدائية بزاكورة', '2024-12-20'],
        ['case-2', 'أ/2024/5678', 'cl-2', 'خديجة الصحراوي', 'قضية أسرة', 'قيد المراجعة', 'طلاق بالاتفاق مع تقسيم الممتلكات', 'قسم قضاء الأسرة بزاكورة', '2024-12-25'],
        ['case-3', 'ش/2024/9012', 'cl-5', 'إبراهيم الدرعي', 'قضية شغل', 'جديدة', 'المطالبة بالتعويض عن الفصل التعسفي', 'المحكمة الابتدائية بزاكورة', NULL],
        ['case-4', 'ع/2024/3456', 'cl-4', 'فاطمة تامازيرت', 'قضية عقارية', 'في المحكمة', 'نزاع حول ملكية عقار موروث', 'محكمة الاستئناف بورزازات', '2024-12-22'],
    ];
    
    $stmt = $conn->prepare("INSERT INTO cases (id, case_number, client_id, client_name, type, status, description, tribunal, next_session, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    foreach ($cases as $c) {
        $stmt->bind_param("sssssssss", $c[0], $c[1], $c[2], $c[3], $c[4], $c[5], $c[6], $c[7], $c[8]);
        $stmt->execute();
    }
    
    // Insert Case Timeline
    $timeline = [
        ['tl-1', 'case-1', '2024-06-15', 'فتح الملف', ''],
        ['tl-2', 'case-1', '2024-07-01', 'تقديم المقال الافتتاحي', ''],
        ['tl-3', 'case-1', '2024-08-15', 'الجلسة الأولى', ''],
        ['tl-4', 'case-2', '2024-09-01', 'فتح الملف', ''],
        ['tl-5', 'case-2', '2024-09-15', 'تقديم طلب الطلاق بالاتفاق', ''],
        ['tl-6', 'case-3', '2024-11-20', 'فتح الملف', ''],
        ['tl-7', 'case-4', '2024-07-10', 'فتح الملف', ''],
        ['tl-8', 'case-4', '2024-08-01', 'تقديم المقال', ''],
    ];
    
    $stmt = $conn->prepare("INSERT INTO case_timeline (id, case_id, date, title, description) VALUES (?, ?, ?, ?, ?)");
    foreach ($timeline as $t) {
        $stmt->bind_param("sssss", $t[0], $t[1], $t[2], $t[3], $t[4]);
        $stmt->execute();
    }
    
    // Insert Consultations
    $consultations = [
        ['cons-1', 'cl-1', 'عبد الله أيت باها', 'استشارة تجارية', 'أريد معرفة حقوقي في حالة عدم تنفيذ الطرف الآخر لالتزاماته التعاقدية', 'completed'],
        ['cons-2', 'cl-6', 'زينب أيت عيسى', 'استشارة عقارية', 'أريد شراء شقة وأحتاج معرفة الإجراءات القانونية اللازمة', 'pending'],
    ];
    
    $stmt = $conn->prepare("INSERT INTO consultations (id, client_id, client_name, topic, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
    foreach ($consultations as $c) {
        $stmt->bind_param("ssssss", $c[0], $c[1], $c[2], $c[3], $c[4], $c[5]);
        $stmt->execute();
    }
    
    // Insert Notifications
    $notifications = [
        ['notif-1', 'تأكيد الموعد', 'تم تأكيد موعدك مع السيد عبد الله أيت باها يوم 15 دجنبر', 'appointment', 0],
        ['notif-2', 'جلسة غداً', 'تذكير: جلسة القضية ج/2024/1234 غداً بالمحكمة الابتدائية بزاكورة', 'case', 0],
        ['notif-3', 'رسالة جديدة', 'لديك رسالة جديدة من الموكلة خديجة الصحراوي', 'message', 1],
        ['notif-4', 'موعد جديد', 'طلب موعد جديد من السيد محمد أوعلي', 'appointment', 0],
        ['notif-5', 'تحديث القضية', 'تم تحديث حالة القضية ع/2024/3456', 'case', 0],
    ];
    
    $stmt = $conn->prepare("INSERT INTO notifications (id, title, message, type, is_read, created_at) VALUES (?, ?, ?, ?, ?, NOW() - INTERVAL FLOOR(RAND() * 72) HOUR)");
    foreach ($notifications as $n) {
        $stmt->bind_param("ssssi", $n[0], $n[1], $n[2], $n[3], $n[4]);
        $stmt->execute();
    }
    
    jsonResponse(['message' => 'Database seeded successfully with dummy data']);
}

$conn->close();
?>
