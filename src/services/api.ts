import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { clients, cases, appointments, services, consultations, notifications } from '@/data/mockData';

// Generic fetch wrapper
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

// Clients API
export const clientsApi = {
  getAll: async () => {
    if (!API_CONFIG.useApi) return clients;
    return apiFetch(API_ENDPOINTS.clients);
  },
  getById: async (id: string) => {
    if (!API_CONFIG.useApi) return clients.find(c => c.id === id);
    return apiFetch(`${API_ENDPOINTS.clients}?id=${id}`);
  },
  create: async (data: any) => {
    if (!API_CONFIG.useApi) {
      const newClient = { ...data, id: `cli-${Date.now()}`, casesCount: 0, appointmentsCount: 0, createdAt: new Date().toISOString() };
      clients.push(newClient);
      return newClient;
    }
    return apiFetch(API_ENDPOINTS.clients, { method: 'POST', body: JSON.stringify(data) });
  },
  update: async (id: string, data: any) => {
    if (!API_CONFIG.useApi) {
      const index = clients.findIndex(c => c.id === id);
      if (index !== -1) clients[index] = { ...clients[index], ...data };
      return clients[index];
    }
    return apiFetch(`${API_ENDPOINTS.clients}?id=${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  delete: async (id: string) => {
    if (!API_CONFIG.useApi) {
      const index = clients.findIndex(c => c.id === id);
      if (index !== -1) clients.splice(index, 1);
      return { success: true };
    }
    return apiFetch(`${API_ENDPOINTS.clients}?id=${id}`, { method: 'DELETE' });
  },
};

// Cases API
export const casesApi = {
  getAll: async () => {
    if (!API_CONFIG.useApi) return cases;
    return apiFetch(API_ENDPOINTS.cases);
  },
  getById: async (id: string) => {
    if (!API_CONFIG.useApi) return cases.find(c => c.id === id);
    return apiFetch(`${API_ENDPOINTS.cases}?id=${id}`);
  },
  create: async (data: any) => {
    if (!API_CONFIG.useApi) {
      const newCase = { 
        ...data, 
        id: `case-${Date.now()}`, 
        caseNumber: `QZ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        timeline: [{ date: new Date().toISOString().split('T')[0], title: 'فتح الملف', description: 'تم إنشاء الملف القضائي' }],
        documents: []
      };
      cases.push(newCase);
      return newCase;
    }
    return apiFetch(API_ENDPOINTS.cases, { method: 'POST', body: JSON.stringify(data) });
  },
  update: async (id: string, data: any) => {
    if (!API_CONFIG.useApi) {
      const index = cases.findIndex(c => c.id === id);
      if (index !== -1) cases[index] = { ...cases[index], ...data };
      return cases[index];
    }
    return apiFetch(`${API_ENDPOINTS.cases}?id=${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  delete: async (id: string) => {
    if (!API_CONFIG.useApi) {
      const index = cases.findIndex(c => c.id === id);
      if (index !== -1) cases.splice(index, 1);
      return { success: true };
    }
    return apiFetch(`${API_ENDPOINTS.cases}?id=${id}`, { method: 'DELETE' });
  },
};

// Appointments API
export const appointmentsApi = {
  getAll: async () => {
    if (!API_CONFIG.useApi) return appointments;
    try {
      return await apiFetch(API_ENDPOINTS.appointments);
    } catch (error) {
      console.warn('Falling back to mock appointments due to API error:', error);
      return appointments;
    }
  },
  getById: async (id: string) => {
    if (!API_CONFIG.useApi) return appointments.find(a => a.id === id);
    return apiFetch(`${API_ENDPOINTS.appointments}?id=${id}`);
  },
  create: async (data: any) => {
    if (!API_CONFIG.useApi) {
      const newAppointment = { ...data, id: `apt-${Date.now()}`, status: 'pending' as const };
      appointments.push(newAppointment);
      return newAppointment;
    }
    return apiFetch(API_ENDPOINTS.appointments, { method: 'POST', body: JSON.stringify(data) });
  },
  update: async (id: string, data: any) => {
    if (!API_CONFIG.useApi) {
      const index = appointments.findIndex(a => a.id === id);
      if (index !== -1) appointments[index] = { ...appointments[index], ...data };
      return appointments[index];
    }
    return apiFetch(`${API_ENDPOINTS.appointments}?id=${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  delete: async (id: string) => {
    if (!API_CONFIG.useApi) {
      const index = appointments.findIndex(a => a.id === id);
      if (index !== -1) appointments.splice(index, 1);
      return { success: true };
    }
    return apiFetch(`${API_ENDPOINTS.appointments}?id=${id}`, { method: 'DELETE' });
  },
};

// Services API
export const servicesApi = {
  getAll: async () => {
    if (!API_CONFIG.useApi) return services;
    return apiFetch(API_ENDPOINTS.services);
  },
  getById: async (id: string) => {
    if (!API_CONFIG.useApi) return services.find(s => s.id === id);
    return apiFetch(`${API_ENDPOINTS.services}?id=${id}`);
  },
  create: async (data: any) => {
    if (!API_CONFIG.useApi) {
      const newService = { ...data, id: `svc-${Date.now()}` };
      services.push(newService);
      return newService;
    }
    return apiFetch(API_ENDPOINTS.services, { method: 'POST', body: JSON.stringify(data) });
  },
  update: async (id: string, data: any) => {
    if (!API_CONFIG.useApi) {
      const index = services.findIndex(s => s.id === id);
      if (index !== -1) services[index] = { ...services[index], ...data };
      return services[index];
    }
    return apiFetch(`${API_ENDPOINTS.services}?id=${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  delete: async (id: string) => {
    if (!API_CONFIG.useApi) {
      const index = services.findIndex(s => s.id === id);
      if (index !== -1) services.splice(index, 1);
      return { success: true };
    }
    return apiFetch(`${API_ENDPOINTS.services}?id=${id}`, { method: 'DELETE' });
  },
};

// Consultations API
export const consultationsApi = {
  getAll: async () => {
    if (!API_CONFIG.useApi) return consultations;
    return apiFetch(API_ENDPOINTS.consultations);
  },
  getById: async (id: string) => {
    if (!API_CONFIG.useApi) return consultations.find(c => c.id === id);
    return apiFetch(`${API_ENDPOINTS.consultations}?id=${id}`);
  },
  create: async (data: any) => {
    if (!API_CONFIG.useApi) {
      const newConsultation = { ...data, id: `cons-${Date.now()}`, status: 'pending' as const, createdAt: new Date().toISOString() };
      consultations.push(newConsultation);
      return newConsultation;
    }
    return apiFetch(API_ENDPOINTS.consultations, { method: 'POST', body: JSON.stringify(data) });
  },
  update: async (id: string, data: any) => {
    if (!API_CONFIG.useApi) {
      const index = consultations.findIndex(c => c.id === id);
      if (index !== -1) consultations[index] = { ...consultations[index], ...data };
      return consultations[index];
    }
    return apiFetch(`${API_ENDPOINTS.consultations}?id=${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  delete: async (id: string) => {
    if (!API_CONFIG.useApi) {
      const index = consultations.findIndex(c => c.id === id);
      if (index !== -1) consultations.splice(index, 1);
      return { success: true };
    }
    return apiFetch(`${API_ENDPOINTS.consultations}?id=${id}`, { method: 'DELETE' });
  },
};

// File Upload API
export const filesApi = {
  upload: async (caseId: string, file: File) => {
    if (!API_CONFIG.useApi) {
      return { 
        id: `file-${Date.now()}`, 
        filename: file.name, 
        original_name: file.name,
        file_type: file.type,
        file_size: file.size 
      };
    }
    const formData = new FormData();
    formData.append('case_id', caseId);
    formData.append('file', file);
    
    const response = await fetch(API_ENDPOINTS.upload, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },
  getForCase: async (caseId: string) => {
    if (!API_CONFIG.useApi) return [];
    return apiFetch(`${API_ENDPOINTS.upload}?case_id=${caseId}`);
  },
  delete: async (id: string) => {
    if (!API_CONFIG.useApi) return { success: true };
    return apiFetch(`${API_ENDPOINTS.upload}?id=${id}`, { method: 'DELETE' });
  },
};

// Stats API
export const statsApi = {
  getAll: async () => {
    if (!API_CONFIG.useApi) {
      return {
        totalCases: cases.length,
        totalClients: clients.length,
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(a => a.status === 'pending').length,
        totalConsultations: consultations.length,
        pendingConsultations: consultations.filter(c => c.status === 'pending').length,
        activeCases: cases.filter(c => c.status !== 'مغلقة').length,
      };
    }
    return apiFetch(API_ENDPOINTS.stats);
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async () => {
    if (!API_CONFIG.useApi) return notifications;
    return apiFetch(API_ENDPOINTS.notifications);
  },
  markAsRead: async (id: string) => {
    if (!API_CONFIG.useApi) {
      const notif = notifications.find(n => n.id === id);
      if (notif) notif.isRead = true;
      return { success: true };
    }
    return apiFetch(`${API_ENDPOINTS.notifications}?id=${id}`, { 
      method: 'PUT', 
      body: JSON.stringify({ is_read: true }) 
    });
  },
  markAllAsRead: async () => {
    if (!API_CONFIG.useApi) {
      notifications.forEach(n => n.isRead = true);
      return { success: true };
    }
    return apiFetch(`${API_ENDPOINTS.notifications}?action=mark_all_read`, { method: 'PUT' });
  },
};

// Seed/Clear Data API
export const seedApi = {
  seedData: async () => {
    return apiFetch(API_ENDPOINTS.seed, { method: 'POST' });
  },
  clearData: async () => {
    return apiFetch(`${API_ENDPOINTS.seed}?action=clear`, { method: 'POST' });
  },
};
