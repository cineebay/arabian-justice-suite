import { 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  dashboardStats, 
  appointments, 
  cases, 
  clients,
  notifications 
} from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const statusColors: Record<string, string> = {
  pending: 'bg-warning/20 text-warning',
  confirmed: 'bg-success/20 text-success',
  completed: 'bg-primary/20 text-primary',
  cancelled: 'bg-destructive/20 text-destructive',
};

const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  completed: 'مكتمل',
  cancelled: 'ملغى',
};

const CHART_COLORS = ['hsl(var(--secondary))', 'hsl(var(--primary))', 'hsl(var(--accent))', '#6366f1', '#8b5cf6'];

export default function DashboardPage() {
  const upcomingAppointments = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'pending')
    .slice(0, 4);
  
  const activeCases = cases.filter(c => c.statusEn !== 'closed').slice(0, 4);
  const recentClients = clients.slice(0, 5);

  const stats = [
    { 
      label: 'إجمالي الموكلين', 
      value: dashboardStats.totalClients, 
      icon: Users, 
      color: 'bg-blue-500/10 text-blue-600',
      trend: '+3 هذا الشهر'
    },
    { 
      label: 'الملفات النشطة', 
      value: dashboardStats.totalCases, 
      icon: FileText, 
      color: 'bg-secondary/10 text-secondary',
      trend: `${dashboardStats.casesThisMonth} جديدة`
    },
    { 
      label: 'المواعيد القادمة', 
      value: dashboardStats.appointmentsThisWeek, 
      icon: Calendar, 
      color: 'bg-green-500/10 text-green-600',
      trend: 'هذا الأسبوع'
    },
    { 
      label: 'الاستشارات', 
      value: dashboardStats.totalConsultations, 
      icon: MessageSquare, 
      color: 'bg-purple-500/10 text-purple-600',
      trend: `${dashboardStats.pendingConsultations} قيد المعالجة`
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="bg-gradient-navy rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-2 text-white">مرحباً بك في مكتبك</h1>
          <p className="text-gold">
            لديك {upcomingAppointments.length} مواعيد قادمة و {activeCases.length} ملفات نشطة
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start justify-between">
                    <div className={cn("p-2 lg:p-3 rounded-xl", stat.color)}>
                      <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  <div className="mt-3 lg:mt-4">
                    <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xs text-secondary mt-1">{stat.trend}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Appointments Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                المواعيد الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.monthlyAppointments}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        direction: 'rtl'
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cases by Type Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary" />
                الملفات حسب النوع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardStats.casesByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="type"
                    >
                      {dashboardStats.casesByType.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        direction: 'rtl'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {dashboardStats.casesByType.map((item, index) => (
                    <div key={item.type} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                      />
                      <span className="text-muted-foreground">{item.type}</span>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary" />
                المواعيد القادمة
              </CardTitle>
              <Link to="/appointments">
                <Button variant="ghost" size="sm">عرض الكل</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div 
                    key={apt.id} 
                    className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-secondary">
                        {apt.clientName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{apt.clientName}</p>
                      <p className="text-sm text-muted-foreground">{apt.service}</p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="text-sm font-medium">{apt.date}</p>
                      <p className="text-xs text-muted-foreground">{apt.time}</p>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium shrink-0",
                      statusColors[apt.status]
                    )}>
                      {statusLabels[apt.status]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Cases */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary" />
                الملفات النشطة
              </CardTitle>
              <Link to="/cases">
                <Button variant="ghost" size="sm">عرض الكل</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeCases.map((caseItem) => (
                  <div 
                    key={caseItem.id} 
                    className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{caseItem.caseNumber}</p>
                      <p className="text-sm text-muted-foreground truncate">{caseItem.clientName}</p>
                    </div>
                    <div className="text-left shrink-0">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        caseItem.statusEn === 'in_court' && "bg-warning/20 text-warning",
                        caseItem.statusEn === 'under_review' && "bg-blue-500/20 text-blue-600",
                        caseItem.statusEn === 'new' && "bg-success/20 text-success"
                      )}>
                        {caseItem.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              الموكلين الجدد
            </CardTitle>
            <Link to="/clients">
              <Button variant="ghost" size="sm">عرض الكل</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {recentClients.map((client) => (
                <div 
                  key={client.id} 
                  className="flex flex-col items-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors text-center"
                >
                  <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-secondary">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  <p className="font-medium text-foreground text-sm truncate w-full">{client.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{client.casesCount} ملفات</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
