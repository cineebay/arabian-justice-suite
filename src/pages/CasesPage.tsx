import { useState } from 'react';
import { Plus, Eye, FileText, Calendar, Clock, Search, Building, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
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
import { FileUpload } from '@/components/cases/FileUpload';
import { useCases, useClients, casesApi } from '@/hooks/useApiData';

const statusStyles: Record<string, { label: string; className: string }> = {
  'جديدة': { label: 'جديدة', className: 'bg-success/20 text-success' },
  'جارية': { label: 'جارية', className: 'bg-blue-500/20 text-blue-600' },
  'معلقة': { label: 'معلقة', className: 'bg-warning/20 text-warning' },
  'مغلقة': { label: 'مغلقة', className: 'bg-muted text-muted-foreground' },
};

export default function CasesPage() {
  const { toast } = useToast();
  const { data: cases, loading, error, refetch } = useCases();
  const { data: clients } = useClients();
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedTimeline, setExpandedTimeline] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  
  // Form state
  const [newCase, setNewCase] = useState({
    client_id: '',
    type: '',
    tribunal: '',
    description: '',
  });

  const filteredCases = (cases || []).filter((caseItem: any) => {
    const clientName = caseItem.clientName || caseItem.client_name || '';
    const caseNumber = caseItem.caseNumber || caseItem.case_number || '';
    const type = caseItem.type || '';
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || caseItem.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    'all': (cases || []).length,
    'جديدة': (cases || []).filter((c: any) => c.status === 'جديدة').length,
    'جارية': (cases || []).filter((c: any) => c.status === 'جارية').length,
    'معلقة': (cases || []).filter((c: any) => c.status === 'معلقة').length,
    'مغلقة': (cases || []).filter((c: any) => c.status === 'مغلقة').length,
  };

  const handleCreateCase = async () => {
    if (!newCase.client_id || !newCase.type) {
      toast({ title: 'يرجى ملء جميع الحقول المطلوبة', variant: 'destructive' });
      return;
    }
    
    setCreating(true);
    try {
      const client = clients.find((c: any) => c.id === newCase.client_id);
      await casesApi.create({
        ...newCase,
        title: newCase.type,
        clientName: client?.name,
      });
      toast({ title: 'تم إنشاء الملف بنجاح' });
      setCreateDialogOpen(false);
      setNewCase({ client_id: '', type: '', tribunal: '', description: '' });
      refetch();
    } catch (err) {
      toast({ title: 'خطأ في إنشاء الملف', variant: 'destructive' });
    } finally {
      setCreating(false);
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
            <h2 className="text-2xl font-bold text-foreground">إدارة الملفات القضائية</h2>
            <p className="text-muted-foreground">جميع القضايا والملفات المفتوحة</p>
          </div>
          <Button variant="gold" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            ملف جديد
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                  placeholder="البحث عن ملف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل ({statusCounts.all})</SelectItem>
                  <SelectItem value="جديدة">جديدة ({statusCounts['جديدة']})</SelectItem>
                  <SelectItem value="جارية">جارية ({statusCounts['جارية']})</SelectItem>
                  <SelectItem value="معلقة">معلقة ({statusCounts['معلقة']})</SelectItem>
                  <SelectItem value="مغلقة">مغلقة ({statusCounts['مغلقة']})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cases List */}
        <div className="space-y-4">
          {filteredCases.map((caseItem: any) => {
            const caseNumber = caseItem.case_number || caseItem.caseNumber || '';
            const clientName = caseItem.client_name || caseItem.clientName || '';
            const court = caseItem.tribunal || caseItem.court || '';
            const nextSession = caseItem.next_session || caseItem.nextSession || '';
            const timeline = caseItem.timeline || [];
            const status = caseItem.status || 'جديدة';
            
            return (
            <Card key={caseItem.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Main Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-foreground">{caseNumber}</h3>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          statusStyles[status]?.className || 'bg-muted text-muted-foreground'
                        )}>
                          {status}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">{clientName}</p>
                      <p className="text-sm text-secondary font-medium">{caseItem.type}</p>
                    </div>
                  </div>

                  {/* Court & Date */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                    {court && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="w-4 h-4" />
                        <span className="truncate max-w-[200px]">{court}</span>
                      </div>
                    )}
                    {nextSession && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span className="font-medium">الجلسة القادمة: {nextSession}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setExpandedTimeline(expandedTimeline === caseItem.id ? null : caseItem.id)}
                    >
                      {expandedTimeline === caseItem.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      المسار
                    </Button>
                    <Button 
                      variant="gold" 
                      size="sm"
                      onClick={() => {
                        setSelectedCase(caseItem);
                        setViewDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      التفاصيل
                    </Button>
                  </div>
                </div>

                {/* Timeline (expandable) */}
                {expandedTimeline === caseItem.id && timeline.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="relative pr-6">
                      {timeline.map((event: any, index: number) => (
                        <div key={index} className="relative pb-4 last:pb-0">
                          <div className="absolute right-0 top-1.5 w-3 h-3 bg-secondary rounded-full" />
                          {index !== timeline.length - 1 && (
                            <div className="absolute right-1.5 top-4 w-0.5 h-full bg-border -translate-x-1/2" />
                          )}
                          <div className="mr-6">
                            <p className="text-sm font-medium text-foreground">{event.title || event.action}</p>
                            <p className="text-xs text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تفاصيل الملف</DialogTitle>
            </DialogHeader>
            {selectedCase && (() => {
              const caseNumber = selectedCase.case_number || selectedCase.caseNumber || '';
              const clientName = selectedCase.client_name || selectedCase.clientName || '';
              const court = selectedCase.tribunal || selectedCase.court || '';
              const nextSession = selectedCase.next_session || selectedCase.nextSession || '';
              const createdAt = selectedCase.created_at || selectedCase.createdAt || '';
              const timeline = selectedCase.timeline || [];
              const documents = selectedCase.documents || selectedCase.files || [];
              const notes = selectedCase.notes || [];
              const status = selectedCase.status || 'جديدة';
              
              return (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{caseNumber}</h3>
                    <p className="text-muted-foreground">{clientName}</p>
                    <span className={cn(
                      "inline-block px-2 py-1 rounded-full text-xs font-medium mt-1",
                      statusStyles[status]?.className || 'bg-muted text-muted-foreground'
                    )}>
                      {status}
                    </span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <Label className="text-xs text-muted-foreground">نوع القضية</Label>
                    <p className="font-medium">{selectedCase.type}</p>
                  </div>
                  {court && (
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="text-xs text-muted-foreground">المحكمة</Label>
                      <p className="font-medium">{court}</p>
                    </div>
                  )}
                  {nextSession && (
                    <div className="p-3 rounded-lg bg-muted/30">
                      <Label className="text-xs text-muted-foreground">الجلسة القادمة</Label>
                      <p className="font-medium">{nextSession}</p>
                    </div>
                  )}
                  <div className="p-3 rounded-lg bg-muted/30">
                    <Label className="text-xs text-muted-foreground">تاريخ الفتح</Label>
                    <p className="font-medium">{createdAt}</p>
                  </div>
                </div>

                {/* Description */}
                {selectedCase.description && (
                <div className="p-4 rounded-lg bg-muted/30">
                  <Label className="text-xs text-muted-foreground">وصف القضية</Label>
                  <p className="text-sm mt-1">{selectedCase.description}</p>
                </div>
                )}

                {/* Documents */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">المستندات الموجودة</Label>
                  {documents.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {documents.map((doc: any, index: number) => (
                      <span key={index} className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg text-sm">
                        {typeof doc === 'string' ? doc : doc.original_name || doc.filename}
                      </span>
                    ))}
                  </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-4">لا توجد مستندات</p>
                  )}
                  
                  {/* File Upload Section */}
                  <Label className="text-sm font-medium mb-2 block">رفع مستندات جديدة</Label>
                  <FileUpload
                    caseId={selectedCase.id}
                    files={uploadedFiles}
                    onFilesChange={setUploadedFiles}
                  />
                </div>

                {/* Timeline */}
                {timeline.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">مسار القضية</Label>
                  <div className="relative pr-6">
                    {timeline.map((event: any, index: number) => (
                      <div key={index} className="relative pb-4 last:pb-0">
                        <div className="absolute right-0 top-1.5 w-3 h-3 bg-secondary rounded-full" />
                        {index !== timeline.length - 1 && (
                          <div className="absolute right-1.5 top-4 w-0.5 h-full bg-border -translate-x-1/2" />
                        )}
                        <div className="mr-6">
                          <p className="font-medium text-foreground">{event.title || event.action}</p>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {/* Notes */}
                {notes.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">الملاحظات</Label>
                    <ul className="space-y-2">
                      {notes.map((note: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              );
            })()}
          </DialogContent>
        </Dialog>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>ملف جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>الموكل *</Label>
                <Select value={newCase.client_id} onValueChange={(val) => setNewCase({...newCase, client_id: val})}>
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
                <Label>نوع القضية *</Label>
                <Select value={newCase.type} onValueChange={(val) => setNewCase({...newCase, type: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="قضية جنائية">قضية جنائية</SelectItem>
                    <SelectItem value="قضية أسرة">قضية أسرة</SelectItem>
                    <SelectItem value="قضية تجارية">قضية تجارية</SelectItem>
                    <SelectItem value="قضية شغل">قضية شغل</SelectItem>
                    <SelectItem value="قضية عقارية">قضية عقارية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المحكمة</Label>
                <Select value={newCase.tribunal} onValueChange={(val) => setNewCase({...newCase, tribunal: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المحكمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="المحكمة الابتدائية بزاكورة">المحكمة الابتدائية بزاكورة</SelectItem>
                    <SelectItem value="قسم قضاء الأسرة بزاكورة">قسم قضاء الأسرة بزاكورة</SelectItem>
                    <SelectItem value="محكمة الاستئناف بورزازات">محكمة الاستئناف بورزازات</SelectItem>
                    <SelectItem value="المحكمة التجارية بورزازات">المحكمة التجارية بورزازات</SelectItem>
                    <SelectItem value="المحكمة الإدارية بأكادير">المحكمة الإدارية بأكادير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>وصف القضية</Label>
                <Textarea 
                  placeholder="وصف مختصر للقضية..." 
                  rows={3}
                  value={newCase.description}
                  onChange={(e) => setNewCase({...newCase, description: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button variant="gold" className="flex-1" onClick={handleCreateCase} disabled={creating}>
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'إنشاء الملف'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
