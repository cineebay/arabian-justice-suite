-- Database Setup for مكتب المحاماة سعيد فائز
-- Run this SQL in phpMyAdmin to create tables and add sample data

-- Drop tables if exist (for clean import)
DROP TABLE IF EXISTS case_timeline;
DROP TABLE IF EXISTS case_files;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS consultations;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS clients;

-- Create clients table
CREATE TABLE clients (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    cin VARCHAR(50),
    cases_count INT DEFAULT 0,
    appointments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create services table
CREATE TABLE services (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create cases table
CREATE TABLE cases (
    id VARCHAR(36) PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL,
    client_id VARCHAR(36),
    client_name VARCHAR(255),
    type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'جديدة',
    tribunal VARCHAR(255),
    description TEXT,
    next_session DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create appointments table
CREATE TABLE appointments (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36),
    client_name VARCHAR(255),
    service VARCHAR(255),
    date DATE NOT NULL,
    time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create consultations table
CREATE TABLE consultations (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36),
    client_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    type VARCHAR(255),
    description TEXT,
    reply TEXT,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create case_files table
CREATE TABLE case_files (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_path VARCHAR(500),
    file_type VARCHAR(100),
    file_size INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create case_timeline table
CREATE TABLE case_timeline (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create notifications table
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type ENUM('appointment', 'case', 'message', 'general') DEFAULT 'general',
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Insert Clients (6 clients)
INSERT INTO clients (id, name, email, phone, address, cin, cases_count, appointments_count) VALUES
('client-001', 'أحمد بن محمد العلوي', 'ahmed.alaoui@email.com', '+212 661-123-456', 'شارع محمد الخامس، زاكورة', 'AB123456', 2, 3),
('client-002', 'فاطمة الزهراء السعدي', 'fatima.saadi@email.com', '+212 662-234-567', 'حي النهضة، ورزازات', 'CD789012', 1, 2),
('client-003', 'محمد أمين الإدريسي', 'amine.idrissi@email.com', '+212 663-345-678', 'شارع الحسن الثاني، الراشيدية', 'EF345678', 1, 1),
('client-004', 'خديجة بنت عبد الله', 'khadija.abdellah@email.com', '+212 664-456-789', 'حي السلام، تنغير', 'GH901234', 0, 2),
('client-005', 'يوسف الحسني', 'youssef.hassani@email.com', '+212 665-567-890', 'زنقة الأطلس، زاكورة', 'IJ567890', 1, 1),
('client-006', 'سعاد المراكشي', 'souad.marrakchi@email.com', '+212 666-678-901', 'شارع النصر، أكدز', 'KL123789', 0, 1);

-- Insert Services (6 services)
INSERT INTO services (id, title, description, icon, price) VALUES
('service-001', 'استشارة قانونية', 'جلسة استشارية مع المحامي لمناقشة القضايا القانونية وتقديم النصائح', 'Scale', 500.00),
('service-002', 'تمثيل أمام المحاكم', 'تمثيل قانوني كامل أمام جميع درجات المحاكم المغربية', 'Gavel', 3000.00),
('service-003', 'صياغة العقود', 'إعداد ومراجعة العقود التجارية والمدنية بكل أنواعها', 'FileText', 1500.00),
('service-004', 'قضايا الأسرة', 'معالجة قضايا الطلاق والنفقة والحضانة والإرث', 'Users', 2000.00),
('service-005', 'القضايا العقارية', 'التعامل مع نزاعات الملكية والعقارات والتسجيل العقاري', 'Building', 2500.00),
('service-006', 'القضايا الجنائية', 'الدفاع في القضايا الجنائية والجنح أمام المحاكم', 'Shield', 5000.00);

-- Insert Cases (5 cases)
INSERT INTO cases (id, case_number, client_id, client_name, type, status, tribunal, description, next_session) VALUES
('case-001', '2024/1234', 'client-001', 'أحمد بن محمد العلوي', 'مدني', 'جارية', 'المحكمة الابتدائية بزاكورة', 'نزاع عقاري حول ملكية أرض فلاحية بمنطقة تازارين', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
('case-002', '2024/1235', 'client-002', 'فاطمة الزهراء السعدي', 'أسرة', 'جارية', 'قسم قضاء الأسرة بورزازات', 'قضية نفقة وحضانة الأطفال بعد الطلاق', DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
('case-003', '2024/1236', 'client-003', 'محمد أمين الإدريسي', 'تجاري', 'معلقة', 'المحكمة التجارية بالراشيدية', 'نزاع تجاري مع شركة توريد مواد البناء', DATE_ADD(CURDATE(), INTERVAL 21 DAY)),
('case-004', '2024/1237', 'client-001', 'أحمد بن محمد العلوي', 'جنائي', 'جديدة', 'محكمة الاستئناف بورزازات', 'قضية تزوير وثائق إدارية - مرحلة الاستئناف', DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
('case-005', '2024/1238', 'client-005', 'يوسف الحسني', 'عقاري', 'مغلقة', 'المحكمة الابتدائية بزاكورة', 'تسجيل عقار في المحافظة العقارية - تم بنجاح', NULL);

-- Insert Appointments (5 appointments)
INSERT INTO appointments (id, client_id, client_name, service, date, time, status, notes, phone, email) VALUES
('apt-001', 'client-001', 'أحمد بن محمد العلوي', 'استشارة قانونية', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', 'confirmed', 'مناقشة تطورات القضية العقارية', '+212 661-123-456', 'ahmed.alaoui@email.com'),
('apt-002', 'client-002', 'فاطمة الزهراء السعدي', 'قضايا الأسرة', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '11:30:00', 'pending', 'تحضير ملف النفقة', '+212 662-234-567', 'fatima.saadi@email.com'),
('apt-003', 'client-004', 'خديجة بنت عبد الله', 'صياغة العقود', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '14:00:00', 'pending', 'مراجعة عقد بيع عقار', '+212 664-456-789', 'khadija.abdellah@email.com'),
('apt-004', 'client-003', 'محمد أمين الإدريسي', 'تمثيل أمام المحاكم', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '09:00:00', 'confirmed', 'جلسة المحكمة التجارية', '+212 663-345-678', 'amine.idrissi@email.com'),
('apt-005', 'client-006', 'سعاد المراكشي', 'استشارة قانونية', CURDATE(), '15:30:00', 'completed', 'استشارة أولية حول قضية إرث', '+212 666-678-901', 'souad.marrakchi@email.com');

-- Insert Consultations (4 consultations)
INSERT INTO consultations (id, client_id, client_name, phone, email, type, description, status, reply) VALUES
('cons-001', 'client-001', 'أحمد بن محمد العلوي', '+212 661-123-456', 'ahmed.alaoui@email.com', 'استشارة عقارية', 'أريد الاستفسار عن إجراءات التسجيل العقاري والوثائق المطلوبة لتسجيل أرض فلاحية', 'completed', 'يجب إحضار عقد الملكية الأصلي، شهادة السكنى، نسخة من بطاقة التعريف الوطنية'),
('cons-002', 'client-002', 'فاطمة الزهراء السعدي', '+212 662-234-567', 'fatima.saadi@email.com', 'قضايا الأسرة', 'ما هي إجراءات الحضانة والنفقة بعد الطلاق؟ وما هي حقوقي القانونية؟', 'completed', 'تُمنح الحضانة للأم بشكل افتراضي للأطفال دون سن التمييز. يحق لك طلب نفقة شهرية تُحدد حسب دخل الأب'),
('cons-003', 'client-004', 'خديجة بنت عبد الله', '+212 664-456-789', 'khadija.abdellah@email.com', 'استشارة تجارية', 'أرغب في مراجعة عقد شراكة تجارية قبل التوقيع عليه', 'pending', NULL),
('cons-004', 'client-005', 'يوسف الحسني', '+212 665-567-890', 'youssef.hassani@email.com', 'قضية جنائية', 'ما هي إجراءات الطعن بالاستئناف في قضية جنائية؟', 'in_progress', NULL);

-- Insert Notifications (6 notifications)
INSERT INTO notifications (id, title, message, type, is_read) VALUES
('notif-001', 'موعد جديد', 'تم حجز موعد جديد من طرف أحمد بن محمد العلوي ليوم غد', 'appointment', 0),
('notif-002', 'جلسة محكمة قادمة', 'تذكير: جلسة القضية رقم 2024/1234 بعد 7 أيام', 'case', 0),
('notif-003', 'تحديث القضية', 'تم تحديث حالة القضية رقم 2024/1238 إلى مغلقة', 'case', 1),
('notif-004', 'رسالة جديدة', 'استفسار من عميل جديد حول خدمات المكتب', 'message', 0),
('notif-005', 'موعد مؤكد', 'تم تأكيد موعد محمد أمين الإدريسي ليوم الخميس', 'appointment', 1),
('notif-006', 'تذكير عام', 'مراجعة ملفات القضايا المعلقة قبل نهاية الأسبوع', 'general', 0);

-- Insert Case Timeline entries (sample timeline for case-001)
INSERT INTO case_timeline (id, case_id, date, title, description) VALUES
('timeline-001', 'case-001', DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'فتح الملف', 'تم استلام الملف وتسجيله في المكتب'),
('timeline-002', 'case-001', DATE_SUB(CURDATE(), INTERVAL 20 DAY), 'تقديم الدعوى', 'تم تقديم عريضة الدعوى للمحكمة'),
('timeline-003', 'case-001', DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'الجلسة الأولى', 'حضور الجلسة الأولى وتقديم المستندات'),
('timeline-004', 'case-002', DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'فتح الملف', 'تسجيل قضية النفقة والحضانة'),
('timeline-005', 'case-002', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'تقديم الطلب', 'تقديم طلب النفقة المؤقتة');
