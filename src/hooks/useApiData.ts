import { useState, useEffect, useCallback } from 'react';
import { clientsApi, casesApi, appointmentsApi, servicesApi, consultationsApi, statsApi, notificationsApi } from '@/services/api';

// Generic hook for API data fetching
function useApiData<T>(fetchFn: () => Promise<T>, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result as T);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, setData };
}

// Type definitions
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  cin?: string;
  casesCount?: number;
  cases_count?: number;
  appointmentsCount?: number;
  appointments_count?: number;
  createdAt?: string;
  created_at?: string;
}

interface Case {
  id: string;
  caseNumber?: string;
  case_number?: string;
  clientName?: string;
  client_name?: string;
  client_id?: string;
  type: string;
  status: string;
  court?: string;
  tribunal?: string;
  nextSession?: string;
  next_session?: string;
  description?: string;
  createdAt?: string;
  created_at?: string;
  timeline?: any[];
  documents?: string[];
  notes?: string[];
}

interface Appointment {
  id: string;
  clientName?: string;
  client_name?: string;
  client_id?: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface Consultation {
  id: string;
  clientName?: string;
  client_name?: string;
  client_id?: string;
  topic: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: string;
  created_at?: string;
}

interface Stats {
  totalCases: number;
  totalClients: number;
  totalAppointments: number;
  pendingAppointments: number;
  totalConsultations: number;
  pendingConsultations: number;
  activeCases: number;
}

// Clients hook
export function useClients() {
  return useApiData<Client[]>(clientsApi.getAll as () => Promise<Client[]>, []);
}

// Cases hook
export function useCases() {
  return useApiData<Case[]>(casesApi.getAll as () => Promise<Case[]>, []);
}

// Appointments hook
export function useAppointments() {
  return useApiData<Appointment[]>(appointmentsApi.getAll as () => Promise<Appointment[]>, []);
}

// Services hook
export function useServices() {
  return useApiData<Service[]>(servicesApi.getAll as () => Promise<Service[]>, []);
}

// Consultations hook
export function useConsultations() {
  return useApiData<Consultation[]>(consultationsApi.getAll as () => Promise<Consultation[]>, []);
}

// Stats hook
export function useStats() {
  return useApiData<Stats>(statsApi.getAll as () => Promise<Stats>, {
    totalCases: 0,
    totalClients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    totalConsultations: 0,
    pendingConsultations: 0,
    activeCases: 0,
  });
}

// Notification interface
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'case' | 'message' | 'general';
  isRead?: boolean;
  is_read?: boolean | number;
  createdAt?: string;
  created_at?: string;
}

// Notifications hook
export function useNotifications() {
  return useApiData<Notification[]>(notificationsApi.getAll as () => Promise<Notification[]>, []);
}

// Export APIs for direct use
export { clientsApi, casesApi, appointmentsApi, servicesApi, consultationsApi, statsApi, notificationsApi };
