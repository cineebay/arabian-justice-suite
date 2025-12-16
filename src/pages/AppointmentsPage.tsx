import { useState } from 'react';
import { Plus, Eye, Check, X, Calendar, Clock, Search, Filter, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppointments, useClients, appointmentsApi } from '@/hooks/useApiData';

const statusStyles: Record<string, { label: string; className: string }> = {
  pending: { label: 'قيد الانتظار', className: 'bg-warning/20 text-warning' },
  confirmed: { label: 'مؤكد', className: 'bg-success/20 text-success' },
  completed: { label: 'مكتمل', className: 'bg-primary/20 text-primary' },
  cancelled: { label: 'ملغى', className: 'bg-destructive/20 text-destructive' },
};

export default function AppointmentsPage() {
  const { toast } = useToast();
  const { data: appointments, loading, error, refetch } = useAppointments();
  const { data: clients } = useClients();
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [creating, setCreating] = useState(false);
  
  // Form state
  const [newAppointment, setNewAppointment] = useState({
    client_id: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });

  const filteredAppointments = (appointments || []).filter((apt: any) => {
    const clientName = apt.clientName || apt.client_name || '';
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (apt: any) => {
    try {
      await appointmentsApi.update(apt.id, { status: 'confirmed' });
      toast({ title: "تم تأكيد الموعد" });
      refetch();
    } catch {
      toast({ title: "خطأ في تأكيد الموعد", variant: "destructive" });
    }
  };

  const handleReject = async (apt: any) => {
    try {
      await appointmentsApi.update(apt.id, { status: 'cancelled' });
      toast({ title: "تم إلغاء الموعد" });
      refetch();
    } catch {
      toast({ title: "خطأ في إلغاء الموعد", variant: "destructive" });
    }
  };

  const handleCreateAppointment = async () => {
    if (!newAppointment.client_id || !newAppointment.service || !newAppointment.date) {
      toast({ title: 'يرجى ملء الحقول المطلوبة', variant: 'destructive' });
      return;
    }
    
    setCreating(true);
    try {
      const client = clients.find((c: any) => c.id === newAppointment.client_id);
      await appointmentsApi.create({
        ...newAppointment,
        clientName: client?.name,
      });
      toast({ title: 'تم إنشاء الموعد بنجاح' });
      setCreateDialogOpen(false);
      setNewAppointment({ client_id: '', service: '', date: '', time: '', notes: '' });
      refetch();
    } catch {
      toast({ title: 'خطأ في إنشاء الموعد', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const statusCounts = {
    all: (appointments || []).length,
    pending: (appointments || []).filter((a: any) => a.status === 'pending').length,
    confirmed: (appointments || []).filter((a: any) => a.status === 'confirmed').length,
    completed: (appointments || []).filter((a: any) => a.status === 'completed').length,
    cancelled: (appointments || []).filter((a: any) => a.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={refetch}>إعادة المحاولة</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">إدارة المواعيد</h2>
            <p className="text-muted-foreground">جميع المواعيد المجدولة</p>
          </div>
          <Button variant="gold" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            موعد جديد
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(statusStyles).map(([status, { label, className }]) => {
            const count = statusCounts[status as keyof typeof statusCounts];
            return (
              <Card 
                key={status} 
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  filterStatus === status && "ring-2 ring-secondary"
                )}
                onClick={() => setFilterStatus(status)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", className)}>
                    {label}
                  </span>
                  <span className="text-2xl font-bold text-foreground">{count}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن موعد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل ({statusCounts.all})</SelectItem>
                  <SelectItem value="pending">قيد الانتظار ({statusCounts.pending})</SelectItem>
                  <SelectItem value="confirmed">مؤكد ({statusCounts.confirmed})</SelectItem>
                  <SelectItem value="completed">مكتمل ({statusCounts.completed})</SelectItem>
                  <SelectItem value="cancelled">ملغى ({statusCounts.cancelled})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((apt) => (
            <Card key={apt.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-secondary">{apt.clientName.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{apt.clientName}</h3>
                      <p className="text-sm text-muted-foreground">{apt.service}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    statusStyles[apt.status].className
                  )}>
                    {statusStyles[apt.status].label}
                  </span>
                </div>

                <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-secondary" />
                    <span>{apt.time}</span>
                  </div>
                </div>

                {apt.notes && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{apt.notes}</p>
                )}

                <div className="flex gap-2">
                  {apt.status === 'pending' && (
                    <>
                      <Button variant="gold" size="sm" className="flex-1" onClick={() => handleApprove(apt)}>
                        <Check className="w-4 h-4" />
                        تأكيد
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleReject(apt)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedAppointment(apt);
                      setViewDialogOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>تفاصيل الموعد</DialogTitle>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <Label className="text-xs text-muted-foreground">الموكل</Label>
                    <p className="font-medium">{selectedAppointment.clientName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <Label className="text-xs text-muted-foreground">الخدمة</Label>
                    <p className="font-medium">{selectedAppointment.service}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <Label className="text-xs text-muted-foreground">التاريخ</Label>
                    <p className="font-medium">{selectedAppointment.date}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <Label className="text-xs text-muted-foreground">الوقت</Label>
                    <p className="font-medium">{selectedAppointment.time}</p>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-muted/30">
                  <Label className="text-xs text-muted-foreground">الحالة</Label>
                  <span className={cn(
                    "inline-block px-3 py-1 rounded-full text-xs font-medium mt-1",
                    statusStyles[selectedAppointment.status].className
                  )}>
                    {statusStyles[selectedAppointment.status].label}
                  </span>
                </div>

                {selectedAppointment.notes && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <Label className="text-xs text-muted-foreground">ملاحظات</Label>
                    <p className="text-sm mt-1">{selectedAppointment.notes}</p>
                  </div>
                )}

                {selectedAppointment.status === 'pending' && (
                  <div className="flex gap-3 pt-4">
                    <Button variant="gold" className="flex-1" onClick={() => handleApprove(selectedAppointment)}>
                      <Check className="w-4 h-4" /> تأكيد الموعد
                    </Button>
                    <Button variant="outline" className="flex-1 text-destructive" onClick={() => handleReject(selectedAppointment)}>
                      <X className="w-4 h-4" /> إلغاء
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>موعد جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>الموكل *</Label>
                <Select value={newAppointment.client_id} onValueChange={(val) => setNewAppointment({...newAppointment, client_id: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الموكل" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client: any) => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الخدمة *</Label>
                <Select value={newAppointment.service} onValueChange={(val) => setNewAppointment({...newAppointment, service: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="استشارة قانونية">استشارة قانونية</SelectItem>
                    <SelectItem value="قضية أسرة">قضية أسرة</SelectItem>
                    <SelectItem value="قضية تجارية">قضية تجارية</SelectItem>
                    <SelectItem value="قضية شغل">قضية شغل</SelectItem>
                    <SelectItem value="قضية عقارية">قضية عقارية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>التاريخ *</Label>
                  <Input 
                    type="date" 
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الوقت</Label>
                  <Input 
                    type="time" 
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>ملاحظات</Label>
                <Textarea 
                  placeholder="أضف ملاحظات..." 
                  rows={3}
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button variant="gold" className="flex-1" onClick={handleCreateAppointment} disabled={creating}>
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'إنشاء الموعد'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
