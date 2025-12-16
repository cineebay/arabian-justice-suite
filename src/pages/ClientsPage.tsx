import { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Mail, Phone, MapPin, CreditCard, Search, Filter, Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useClients, clientsApi } from '@/hooks/useApiData';

export default function ClientsPage() {
  const { toast } = useToast();
  const { data: clients, loading, error, refetch } = useClients();
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [creating, setCreating] = useState(false);
  
  // Form state
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cin: '',
  });

  const filteredClients = (clients || []).filter((client: any) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleView = (client: any) => {
    setSelectedClient(client);
    setViewDialogOpen(true);
  };

  const handleCreateClient = async () => {
    if (!newClient.name || !newClient.phone) {
      toast({ title: 'يرجى ملء الاسم ورقم الهاتف', variant: 'destructive' });
      return;
    }
    
    setCreating(true);
    try {
      await clientsApi.create(newClient);
      toast({ title: 'تم إضافة الموكل بنجاح' });
      setCreateDialogOpen(false);
      setNewClient({ name: '', email: '', phone: '', address: '', cin: '' });
      refetch();
    } catch (err) {
      toast({ title: 'خطأ في إضافة الموكل', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await clientsApi.delete(id);
      toast({ title: 'تم حذف الموكل' });
      refetch();
    } catch (err) {
      toast({ title: 'خطأ في حذف الموكل', variant: 'destructive' });
    }
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
            <h2 className="text-2xl font-bold text-foreground">إدارة الموكلين</h2>
            <p className="text-muted-foreground">قائمة جميع الموكلين وبياناتهم</p>
          </div>
          <Button variant="gold" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            إضافة موكل جديد
          </Button>
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن موكل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4" />
                تصفية
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clients Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleView(client)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-secondary">{client.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">{client.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                    <p className="text-sm text-muted-foreground" dir="ltr">{client.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                  <div className="flex-1 text-center">
                    <p className="text-xl font-bold text-secondary">{client.casesCount}</p>
                    <p className="text-xs text-muted-foreground">ملفات</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-xl font-bold text-primary">{client.appointmentsCount}</p>
                    <p className="text-xs text-muted-foreground">مواعيد</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleView(client); }}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => e.stopPropagation()}>
                    <Trash2 className="w-4 h-4" />
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
              <DialogTitle>تفاصيل الموكل</DialogTitle>
            </DialogHeader>
            {selectedClient && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-secondary">{selectedClient.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedClient.name}</h3>
                    <p className="text-sm text-muted-foreground">موكل منذ {selectedClient.createdAt}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Mail className="w-5 h-5 text-secondary" />
                    <div>
                      <Label className="text-xs text-muted-foreground">البريد الإلكتروني</Label>
                      <p className="text-sm">{selectedClient.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Phone className="w-5 h-5 text-secondary" />
                    <div>
                      <Label className="text-xs text-muted-foreground">رقم الهاتف</Label>
                      <p className="text-sm" dir="ltr">{selectedClient.phone}</p>
                    </div>
                  </div>

                  {selectedClient.address && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <MapPin className="w-5 h-5 text-secondary" />
                      <div>
                        <Label className="text-xs text-muted-foreground">العنوان</Label>
                        <p className="text-sm">{selectedClient.address}</p>
                      </div>
                    </div>
                  )}

                  {selectedClient.cin && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <CreditCard className="w-5 h-5 text-secondary" />
                      <div>
                        <Label className="text-xs text-muted-foreground">رقم البطاقة الوطنية</Label>
                        <p className="text-sm">{selectedClient.cin}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="bg-secondary/10 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-secondary">{selectedClient.casesCount}</p>
                    <p className="text-sm text-muted-foreground">إجمالي الملفات</p>
                  </div>
                  <div className="bg-primary/10 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-primary">{selectedClient.appointmentsCount}</p>
                    <p className="text-sm text-muted-foreground">المواعيد</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="gold" className="flex-1">عرض الملفات</Button>
                  <Button variant="outline" className="flex-1">عرض المواعيد</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة موكل جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>الاسم الكامل *</Label>
                <Input 
                  placeholder="أدخل اسم الموكل" 
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>رقم الهاتف *</Label>
                <Input 
                  placeholder="+212 6XX XXX XXX" 
                  dir="ltr"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input 
                  type="email" 
                  placeholder="email@example.com" 
                  dir="ltr"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>العنوان</Label>
                <Input 
                  placeholder="أدخل العنوان" 
                  value={newClient.address}
                  onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>رقم البطاقة الوطنية</Label>
                <Input 
                  placeholder="XXXXXXXXX" 
                  dir="ltr"
                  value={newClient.cin}
                  onChange={(e) => setNewClient({...newClient, cin: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button variant="gold" className="flex-1" onClick={handleCreateClient} disabled={creating}>
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'إضافة الموكل'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
