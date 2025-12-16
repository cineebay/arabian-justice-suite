// Mock Data for Rashed Aldawsari Lawfirm - Saudi Arabia

export interface Lawyer {
  id: string;
  name: string;
  nameEn: string;
  specialty: string;
  specialtyEn: string;
  experience: number;
  bio: string;
  image: string;
  phone: string;
  email: string;
  cases: number;
  rating: number;
}

export interface Service {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  price?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  nationalId?: string; // Saudi National ID
  casesCount: number;
  appointmentsCount: number;
  createdAt: string;
  avatar?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  lawyerId: string;
  lawyerName: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  clientId: string;
  clientName: string;
  lawyerId: string;
  lawyerName: string;
  type: string;
  status: 'جديدة' | 'قيد المراجعة' | 'في المحكمة' | 'مغلقة';
  statusEn: 'new' | 'under_review' | 'in_court' | 'closed';
  description: string;
  court?: string;
  nextSession?: string;
  createdAt: string;
  updatedAt: string;
  documents: string[];
  notes: string[];
  timeline: { date: string; action: string }[];
}

export interface Consultation {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  details: string;
  status: 'pending' | 'in_progress' | 'completed';
  attachments: string[];
  createdAt: string;
  response?: string;
}

export interface Message {
  id: string;
  clientId: string;
  clientName: string;
  subject: string;
  content: string;
  category: 'case' | 'appointment' | 'general';
  isRead: boolean;
  createdAt: string;
  replies: { content: string; isAdmin: boolean; createdAt: string }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'case' | 'message' | 'general';
  isRead: boolean;
  createdAt: string;
}

// Office Owner - Rashed Aldawsari
export const officeLawyer: Lawyer = {
  id: '1',
  name: 'المحامي راشد الدوسري',
  nameEn: 'Rashed Aldawsari',
  specialty: 'محامون ومستشارون قانونيون',
  specialtyEn: 'Lawyers and Legal Consultants',
  experience: 18,
  bio: 'شركة محاماة واستشارات قانونية مرخّصة في المملكة العربية السعودية، تأسست بهدف تقديم خدمات قانونية متكاملة تواكب التطورات التشريعية والاقتصادية في المملكة. تضم الشركة نخبة من المحامين والمستشارين ذوي الخبرة الواسعة في مختلف المجالات القانونية.',
  image: '/lawyers/lawyer1.jpg',
  phone: '+966 570 404 888',
  email: 'info@rashedlawfirm.sa',
  cases: 856,
  rating: 4.9,
};

// Saudi Arabian Courts
export const tribunals = [
  // المحاكم في المملكة العربية السعودية
  'المحكمة العامة بالرياض',
  'المحكمة الجزائية بالرياض',
  'المحكمة التجارية بالرياض',
  'المحكمة العمالية بالرياض',
  'محكمة الأحوال الشخصية بالرياض',
  'محكمة الاستئناف بالرياض',
  'المحكمة العليا',
  'ديوان المظالم',
  'المحكمة العامة بجدة',
  'المحكمة التجارية بجدة',
  'المحكمة العامة بالدمام',
  'المحكمة التجارية بالدمام',
];

export const lawyers: Lawyer[] = [officeLawyer];

export const services: Service[] = [
  {
    id: '1',
    title: 'القضايا الجنائية',
    titleEn: 'Criminal Cases',
    description: 'الترافع أمام المحاكم الجزائية في جميع القضايا الجنائية وفق النظام السعودي',
    icon: 'scale',
  },
  {
    id: '2',
    title: 'قضايا الأحوال الشخصية',
    titleEn: 'Personal Status',
    description: 'الطلاق، النفقة، الحضانة، الميراث وفق الشريعة الإسلامية والأنظمة السعودية',
    icon: 'users',
  },
  {
    id: '3',
    title: 'القضايا التجارية',
    titleEn: 'Commercial Cases',
    description: 'تأسيس الشركات، العقود التجارية، النزاعات التجارية، الإفلاس والتصفية',
    icon: 'briefcase',
  },
  {
    id: '4',
    title: 'القضايا العقارية',
    titleEn: 'Real Estate',
    description: 'نزاعات الملكية، عقود البيع والإيجار، التطوير العقاري، الصكوك',
    icon: 'building',
  },
  {
    id: '5',
    title: 'قضايا العمل',
    titleEn: 'Labor Law',
    description: 'حقوق العمال، الفصل التعسفي، مكافأة نهاية الخدمة، نظام العمل السعودي',
    icon: 'hammer',
  },
  {
    id: '6',
    title: 'الاستشارات القانونية',
    titleEn: 'Legal Consultation',
    description: 'استشارات قانونية متخصصة في جميع المجالات مع السرية التامة',
    icon: 'message-circle',
  },
];

export const clients: Client[] = [
  {
    id: '1',
    name: 'عبدالرحمن السعيد',
    phone: '+966 55 123 4567',
    email: 'abdulrahman.alsaeed@gmail.com',
    address: 'حي النخيل، الرياض',
    nationalId: '1089234567',
    casesCount: 2,
    appointmentsCount: 5,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'نورة القحطاني',
    phone: '+966 55 234 5678',
    email: 'noura.alqahtani@gmail.com',
    address: 'حي الملقا، الرياض',
    nationalId: '1078345678',
    casesCount: 1,
    appointmentsCount: 3,
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'محمد العتيبي',
    phone: '+966 55 345 6789',
    email: 'mohammed.alotaibi@gmail.com',
    address: 'حي الياسمين، الرياض',
    nationalId: '1067456789',
    casesCount: 3,
    appointmentsCount: 8,
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'سارة الغامدي',
    phone: '+966 55 456 7890',
    email: 'sara.alghamdi@gmail.com',
    address: 'حي الربيع، الرياض',
    nationalId: '1056567890',
    casesCount: 1,
    appointmentsCount: 2,
    createdAt: '2024-04-05',
  },
  {
    id: '5',
    name: 'فهد الشمري',
    phone: '+966 55 567 8901',
    email: 'fahad.alshammari@gmail.com',
    address: 'حي الورود، الرياض',
    nationalId: '1045678901',
    casesCount: 2,
    appointmentsCount: 4,
    createdAt: '2024-05-12',
  },
  {
    id: '6',
    name: 'هند المطيري',
    phone: '+966 55 678 9012',
    email: 'hind.almutairi@gmail.com',
    address: 'حي النرجس، الرياض',
    nationalId: '1034789012',
    casesCount: 1,
    appointmentsCount: 2,
    createdAt: '2024-06-18',
  },
];

export const appointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'عبدالرحمن السعيد',
    lawyerId: '1',
    lawyerName: 'المحامي راشد الدوسري',
    service: 'استشارة قانونية',
    date: '2024-12-15',
    time: '10:00',
    status: 'confirmed',
    notes: 'موعد لمناقشة قضية تجارية',
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'نورة القحطاني',
    lawyerId: '1',
    lawyerName: 'المحامي راشد الدوسري',
    service: 'قضية أحوال شخصية',
    date: '2024-12-16',
    time: '14:00',
    status: 'pending',
    notes: 'ملف حضانة',
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'محمد العتيبي',
    lawyerId: '1',
    lawyerName: 'المحامي راشد الدوسري',
    service: 'عقد تجاري',
    date: '2024-12-14',
    time: '11:30',
    status: 'completed',
  },
  {
    id: '4',
    clientId: '4',
    clientName: 'سارة الغامدي',
    lawyerId: '1',
    lawyerName: 'المحامي راشد الدوسري',
    service: 'قضية عقارية',
    date: '2024-12-17',
    time: '09:30',
    status: 'pending',
  },
  {
    id: '5',
    clientId: '5',
    clientName: 'فهد الشمري',
    lawyerId: '1',
    lawyerName: 'المحامي راشد الدوسري',
    service: 'قضية عمالية',
    date: '2024-12-18',
    time: '15:00',
    status: 'confirmed',
    notes: 'فصل تعسفي - تعويضات',
  },
];

export const cases: Case[] = [
  {
    id: '1',
    caseNumber: 'ت/1446/1234',
    clientId: '1',
    clientName: 'عبدالرحمن السعيد',
    lawyerId: '1',
    lawyerName: 'المحامي راشد الدوسري',
    type: 'قضية تجارية',
    status: 'في المحكمة',
    statusEn: 'in_court',
    description: 'نزاع تجاري حول عدم تنفيذ عقد توريد',
    court: 'المحكمة التجارية بالرياض',
    nextSession: '2024-12-20',
    createdAt: '2024-06-15',
    updatedAt: '2024-12-10',
    documents: ['العقد الأصلي', 'محضر الإنذار', 'فواتير التوريد'],
    notes: ['تم تقديم صحيفة الدعوى', 'في انتظار رد المدعى عليه'],
    timeline: [
      { date: '2024-06-15', action: 'فتح الملف' },
      { date: '2024-07-01', action: 'تقديم صحيفة الدعوى' },
      { date: '2024-08-15', action: 'الجلسة الأولى' },
      { date: '2024-10-20', action: 'تأجيل للرد' },
    ],
  },
  {
    id: '2',
    caseNumber: 'ش/1446/5678',
    clientId: '2',
    clientName: 'نورة القحطاني',
    lawyerId: '1',
    lawyerName: 'المحامي راشد الدوسري',
    type: 'قضية أحوال شخصية',
    status: 'قيد المراجعة',
    statusEn: 'under_review',
    description: 'دعوى حضانة أطفال',
    court: 'محكمة الأحوال الشخصية بالرياض',
    nextSession: '2024-12-25',
    createdAt: '2024-09-01',
    updatedAt: '2024-12-08',
    documents: ['عقد الزواج', 'شهادات ميلاد الأطفال', 'تقارير اجتماعية'],
    notes: ['تم تقديم طلب الحضانة'],
    timeline: [
      { date: '2024-09-01', action: 'فتح الملف' },
      { date: '2024-09-15', action: 'تقديم طلب الحضانة' },
    ],
  },
  {
    id: '3',
    caseNumber: 'ع/1446/9012',
    clientId: '5',
    clientName: 'فهد الشمري',
    lawyerId: '1',
    lawyerName: 'المحامي راشد الدوسري',
    type: 'قضية عمالية',
    status: 'جديدة',
    statusEn: 'new',
    description: 'المطالبة بالتعويض عن الفصل التعسفي ومستحقات نهاية الخدمة',
    court: 'المحكمة العمالية بالرياض',
    createdAt: '2024-11-20',
    updatedAt: '2024-12-05',
    documents: ['عقد العمل', 'كشف الراتب', 'خطاب إنهاء الخدمة'],
    notes: ['جمع الوثائق اللازمة'],
    timeline: [
      { date: '2024-11-20', action: 'فتح الملف' },
      { date: '2024-12-05', action: 'تحضير صحيفة الدعوى' },
    ],
  },
  {
    id: '4',
    caseNumber: 'ق/1446/3456',
    clientId: '4',
    clientName: 'سارة الغامدي',
    lawyerId: '1',
    lawyerName: 'المحامي راشد الدوسري',
    type: 'قضية عقارية',
    status: 'في المحكمة',
    statusEn: 'in_court',
    description: 'نزاع حول ملكية عقار',
    court: 'المحكمة العامة بالرياض',
    nextSession: '2024-12-22',
    createdAt: '2024-07-10',
    updatedAt: '2024-12-01',
    documents: ['صك الملكية', 'عقد البيع', 'تقرير خبير عقاري'],
    notes: ['تم طلب تقرير خبرة عقارية'],
    timeline: [
      { date: '2024-07-10', action: 'فتح الملف' },
      { date: '2024-08-01', action: 'تقديم الدعوى' },
      { date: '2024-09-15', action: 'الأمر بإجراء خبرة' },
    ],
  },
];

export const consultations: Consultation[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'عبدالرحمن السعيد',
    type: 'استشارة تجارية',
    details: 'أريد معرفة حقوقي في حالة عدم تنفيذ الطرف الآخر لالتزاماته التعاقدية',
    status: 'completed',
    attachments: ['العقد.pdf'],
    createdAt: '2024-12-01',
    response: 'بناءً على مراجعة العقد، لديكم الحق في المطالبة بالتعويض وفق نظام المحاكم التجارية...',
  },
  {
    id: '2',
    clientId: '6',
    clientName: 'هند المطيري',
    type: 'استشارة عقارية',
    details: 'أريد شراء أرض وأحتاج معرفة الإجراءات القانونية اللازمة للتأكد من سلامة الصك',
    status: 'in_progress',
    attachments: ['صورة_الصك.pdf'],
    createdAt: '2024-12-05',
  },
];

export const messages: Message[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'عبدالرحمن السعيد',
    subject: 'استفسار عن موعد الجلسة',
    content: 'السلام عليكم، متى موعد الجلسة القادمة لقضيتي؟',
    category: 'case',
    isRead: true,
    createdAt: '2024-12-10T10:30:00',
    replies: [
      {
        content: 'وعليكم السلام، الجلسة القادمة يوم 20 ديسمبر بالمحكمة التجارية بالرياض',
        isAdmin: true,
        createdAt: '2024-12-10T11:00:00',
      },
    ],
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'نورة القحطاني',
    subject: 'طلب تغيير موعد',
    content: 'هل يمكن تغيير موعد الاستشارة إلى يوم آخر؟',
    category: 'appointment',
    isRead: false,
    createdAt: '2024-12-11T14:20:00',
    replies: [],
  },
];

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'تأكيد الموعد',
    message: 'تم تأكيد موعدك مع السيد عبدالرحمن السعيد يوم 15 ديسمبر',
    type: 'appointment',
    isRead: false,
    createdAt: '2024-12-10T09:00:00',
  },
  {
    id: '2',
    title: 'جلسة غداً',
    message: 'تذكير: جلسة القضية ت/1446/1234 غداً بالمحكمة التجارية بالرياض',
    type: 'case',
    isRead: false,
    createdAt: '2024-12-09T15:30:00',
  },
  {
    id: '3',
    title: 'رسالة جديدة',
    message: 'لديك رسالة جديدة من الموكلة نورة القحطاني',
    type: 'message',
    isRead: true,
    createdAt: '2024-12-08T11:00:00',
  },
];

// Dashboard Statistics
export const dashboardStats = {
  totalCases: 156,
  totalConsultations: 89,
  totalAppointments: 432,
  totalClients: 127,
  casesThisMonth: 12,
  appointmentsThisWeek: 18,
  pendingConsultations: 8,
  monthlyAppointments: [42, 38, 55, 48, 62, 58, 45, 52, 60, 55, 48, 65],
  revenue: {
    thisMonth: 285000,
    lastMonth: 267000,
    growth: 6.7,
  },
  casesByStatus: {
    new: 23,
    underReview: 45,
    inCourt: 67,
    closed: 21,
  },
  casesByType: [
    { type: 'تجارية', count: 45 },
    { type: 'أحوال شخصية', count: 32 },
    { type: 'عمالية', count: 28 },
    { type: 'عقارية', count: 25 },
    { type: 'جنائية', count: 18 },
    { type: 'أخرى', count: 8 },
  ],
};

