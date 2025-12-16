import { useState } from 'react';
import { Calendar, Clock, User, Plus } from 'lucide-react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Button } from '@/components/ui/button';
import { appointments } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: 'قيد الانتظار', className: 'status-pending' },
  confirmed: { label: 'مؤكد', className: 'status-confirmed' },
  completed: { label: 'مكتمل', className: 'status-completed' },
  cancelled: { label: 'ملغي', className: 'status-cancelled' },
};

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<string>('all');

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  return (
    <MobileLayout title="المواعيد" showBack>
      <div className="px-5 py-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
          {[
            { key: 'all', label: 'الكل' },
            { key: 'pending', label: 'قيد الانتظار' },
            { key: 'confirmed', label: 'مؤكد' },
            { key: 'completed', label: 'مكتمل' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                filter === tab.key
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => (
            <div
              key={appointment.id}
              className="bg-card rounded-xl p-5 shadow-md border border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-foreground">{appointment.service}</h3>
                  <p className="text-sm text-muted-foreground">مع {appointment.lawyerName}</p>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  statusLabels[appointment.status].className
                )}>
                  {statusLabels[appointment.status].label}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span>{appointment.time}</span>
                </div>
              </div>

              {appointment.notes && (
                <p className="mt-3 text-sm text-muted-foreground border-t border-border pt-3">
                  {appointment.notes}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">لا توجد مواعيد</p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <Link
        to="/appointments/new"
        className="fixed bottom-24 left-5 w-14 h-14 bg-secondary rounded-full shadow-gold flex items-center justify-center text-secondary-foreground hover:scale-110 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </MobileLayout>
  );
}
