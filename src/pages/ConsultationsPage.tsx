import { useState } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Search, Reply, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useConsultations, consultationsApi } from '@/hooks/useApiData';
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

const statusStyles: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: 'قيد الانتظار', className: 'bg-warning/20 text-warning', icon: Clock },
  in_progress: { label: 'قيد المعالجة', className: 'bg-blue-500/20 text-blue-600', icon: AlertCircle },
  completed: { label: 'مكتملة', className: 'bg-success/20 text-success', icon: CheckCircle },
};

export default function ConsultationsPage() {
  const { toast } = useToast();
  const { data: consultations, loading, error, refetch } = useConsultations();
  const [selectedConsultation, setSelectedConsultation] = useState<any | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');

  const filteredConsultations = (consultations || []).filter((consultation: any) => {
    const clientName = consultation.client_name || consultation.clientName || '';
    const type = consultation.type || consultation.topic || '';
    const details = consultation.description || consultation.notes || '';
    return clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      details.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleReply = async () => {
    if (replyText.trim() && selectedConsultation) {
      try {
        await consultationsApi.update(selectedConsultation.id, {
          ...selectedConsultation,
          reply: replyText,
          status: 'completed'
        });
        toast({
          title: "تم إرسال الرد",
          description: "تم إرسال ردك على الاستشارة بنجاح",
        });
        setReplyText('');
        setViewDialogOpen(false);
        refetch();
      } catch (err) {
        toast({ title: "خطأ في إرسال الرد", variant: "destructive" });
      }
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
            <h2 className="text-2xl font-bold text-foreground">إدارة الاستشارات</h2>
            <p className="text-muted-foreground">جميع طلبات الاستشارات القانونية</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(statusStyles).map(([status, { label, className, icon: Icon }]) => {
            const count = (consultations || []).filter((c: any) => c.status === status).length;
            return (
              <Card key={status}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl", className.replace('text-', 'bg-').replace('/20', '/10'))}>
                    <Icon className={cn("w-6 h-6", className.split(' ')[1])} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الاستشارات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Consultations List */}
        <div className="space-y-4">
          {filteredConsultations.map((consultation: any) => {
            const status = consultation.status || 'pending';
            const StatusIcon = statusStyles[status]?.icon || Clock;
            const clientName = consultation.client_name || consultation.clientName || '';
            const type = consultation.type || consultation.topic || '';
            const details = consultation.description || consultation.notes || '';
            const createdAt = consultation.created_at || consultation.createdAt || '';
            
            return (
              <Card 
                key={consultation.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedConsultation(consultation);
                  setViewDialogOpen(true);
                }}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                        <MessageSquare className="w-7 h-7 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-foreground">{clientName}</h3>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            statusStyles[status]?.className || 'bg-muted text-muted-foreground'
                          )}>
                            {statusStyles[status]?.label || status}
                          </span>
                        </div>
                        <p className="text-sm text-secondary font-medium mb-2">{type}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{details}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        {createdAt}
                      </div>
                      <Button variant="gold" size="sm">
                        <Reply className="w-4 h-4" />
                        الرد
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تفاصيل الاستشارة</DialogTitle>
            </DialogHeader>
            {selectedConsultation && (() => {
              const clientName = selectedConsultation.client_name || selectedConsultation.clientName || '';
              const type = selectedConsultation.type || selectedConsultation.topic || '';
              const details = selectedConsultation.description || selectedConsultation.notes || '';
              const createdAt = selectedConsultation.created_at || selectedConsultation.createdAt || '';
              const status = selectedConsultation.status || 'pending';
              const reply = selectedConsultation.reply || selectedConsultation.response || '';
              
              return (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-secondary">
                        {clientName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground">{clientName}</h3>
                      <p className="text-secondary font-medium">{type}</p>
                      <span className={cn(
                        "inline-block px-2 py-1 rounded-full text-xs font-medium mt-1",
                        statusStyles[status]?.className || 'bg-muted text-muted-foreground'
                      )}>
                        {statusStyles[status]?.label || status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {createdAt}
                    </div>
                  </div>

                  {/* Question */}
                  <div className="p-4 rounded-lg bg-muted/30">
                    <Label className="text-xs text-muted-foreground mb-2 block">تفاصيل الاستشارة</Label>
                    <p className="text-foreground">{details}</p>
                  </div>

                  {/* Previous Response */}
                  {reply && (
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <Label className="text-xs text-success mb-2 block">الرد السابق</Label>
                      <p className="text-foreground">{reply}</p>
                    </div>
                  )}

                  {/* Reply Form */}
                  <div className="space-y-3">
                    <Label>الرد على الاستشارة</Label>
                    <Textarea
                      placeholder="اكتب ردك على الاستشارة..."
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setViewDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button variant="gold" className="flex-1" onClick={handleReply}>
                        <Reply className="w-4 h-4" />
                        إرسال الرد
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
