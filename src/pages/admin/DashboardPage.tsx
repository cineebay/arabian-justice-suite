import { FileText, Users, Calendar, MessageCircle, TrendingUp, Clock } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { dashboardStats, appointments, cases, messages } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

const COLORS = ['#D4AF37', '#0A1A2F', '#F3D98E', '#6B7280', '#10B981'];

const statusColors: Record<string, string> = {
  pending: 'bg-warning/20 text-warning',
  confirmed: 'bg-success/20 text-success',
  completed: 'bg-primary/20 text-primary',
  cancelled: 'bg-destructive/20 text-destructive',
};

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Cases"
            value={dashboardStats.totalCases}
            change={`+${dashboardStats.casesThisMonth} this month`}
            changeType="positive"
            icon={FileText}
          />
          <StatsCard
            title="Consultations"
            value={dashboardStats.totalConsultations}
            change={`${dashboardStats.pendingConsultations} pending`}
            changeType="neutral"
            icon={MessageCircle}
          />
          <StatsCard
            title="Appointments"
            value={dashboardStats.totalAppointments}
            change={`${dashboardStats.appointmentsThisWeek} this week`}
            changeType="positive"
            icon={Calendar}
          />
          <StatsCard
            title="Total Clients"
            value={dashboardStats.totalClients}
            change="+12% growth"
            changeType="positive"
            icon={Users}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart - Monthly Appointments */}
          <div className="lg:col-span-2 bg-card rounded-xl p-6 shadow-md border border-border/50">
            <h3 className="text-lg font-bold text-foreground mb-6">Monthly Appointments</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardStats.monthlyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Cases by Type */}
          <div className="bg-card rounded-xl p-6 shadow-md border border-border/50">
            <h3 className="text-lg font-bold text-foreground mb-6">Cases by Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardStats.casesByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="type"
                  >
                    {dashboardStats.casesByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {dashboardStats.casesByType.map((item, index) => (
                <div key={item.type} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-muted-foreground">{item.type}</span>
                  </div>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Appointments */}
          <div className="bg-card rounded-xl p-6 shadow-md border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Recent Appointments</h3>
              <a href="/admin/appointments" className="text-sm text-secondary hover:text-gold-dark">View All</a>
            </div>
            <div className="space-y-4">
              {appointments.slice(0, 4).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{appointment.clientName}</p>
                      <p className="text-xs text-muted-foreground">{appointment.service}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{appointment.date}</p>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      statusColors[appointment.status]
                    )}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-card rounded-xl p-6 shadow-md border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Recent Messages</h3>
              <a href="/admin/messages" className="text-sm text-secondary hover:text-gold-dark">View All</a>
            </div>
            <div className="space-y-4">
              {messages.slice(0, 4).map((message) => (
                <div key={message.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-secondary">
                      {message.clientName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground text-sm truncate">{message.clientName}</p>
                      {!message.isRead && (
                        <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{message.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
