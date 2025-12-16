import { useState } from 'react';
import { Scale, Users, Briefcase, Building, Hammer, MessageCircle, Edit, Plus, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useServices, servicesApi } from '@/hooks/useApiData';

const iconMap: Record<string, typeof Scale> = {
  scale: Scale,
  users: Users,
  briefcase: Briefcase,
  building: Building,
  hammer: Hammer,
  'message-circle': MessageCircle,
};

export default function ServicesPage() {
  const { toast } = useToast();
  const { data: services, loading, error, refetch } = useServices();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  
  // Form state
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    icon: 'scale',
  });

  const handleCreateService = async () => {
    if (!newService.title) {
      toast({ title: 'يرجى إدخال عنوان الخدمة', variant: 'destructive' });
      return;
    }
    
    setCreating(true);
    try {
      await servicesApi.create(newService);
      toast({ title: 'تم إضافة الخدمة بنجاح' });
      setCreateDialogOpen(false);
      setNewService({ title: '', description: '', icon: 'scale' });
      refetch();
    } catch {
      toast({ title: 'خطأ في إضافة الخدمة', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateService = async () => {
    if (!selectedService) return;
    
    try {
      await servicesApi.update(selectedService.id, selectedService);
      toast({ title: 'تم حفظ التعديلات' });
      setEditDialogOpen(false);
      refetch();
    } catch {
      toast({ title: 'خطأ في حفظ التعديلات', variant: 'destructive' });
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
            <h2 className="text-2xl font-bold text-foreground">الخدمات القانونية</h2>
            <p className="text-muted-foreground">قائمة الخدمات التي يقدمها المكتب</p>
          </div>
          <Button variant="gold" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            إضافة خدمة
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(services || []).map((service: any) => {
            const Icon = iconMap[service.icon] || Scale;
            return (
              <Card key={service.id} className="hover:shadow-lg transition-all group">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{service.description}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setSelectedService({...service});
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                    تعديل
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>تعديل الخدمة</DialogTitle>
            </DialogHeader>
            {selectedService && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>عنوان الخدمة</Label>
                  <Input 
                    value={selectedService.title} 
                    onChange={(e) => setSelectedService({...selectedService, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الوصف</Label>
                  <Textarea 
                    value={selectedService.description} 
                    rows={4}
                    onChange={(e) => setSelectedService({...selectedService, description: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setEditDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button variant="gold" className="flex-1" onClick={handleUpdateService}>
                    حفظ التعديلات
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة خدمة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>عنوان الخدمة *</Label>
                <Input 
                  placeholder="عنوان الخدمة" 
                  value={newService.title}
                  onChange={(e) => setNewService({...newService, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea 
                  placeholder="وصف الخدمة..." 
                  rows={4}
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>الأيقونة</Label>
                <Select value={newService.icon} onValueChange={(val) => setNewService({...newService, icon: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scale">ميزان</SelectItem>
                    <SelectItem value="users">مجموعة</SelectItem>
                    <SelectItem value="briefcase">حقيبة</SelectItem>
                    <SelectItem value="building">مبنى</SelectItem>
                    <SelectItem value="hammer">مطرقة</SelectItem>
                    <SelectItem value="message-circle">رسالة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button variant="gold" className="flex-1" onClick={handleCreateService} disabled={creating}>
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'إضافة الخدمة'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
