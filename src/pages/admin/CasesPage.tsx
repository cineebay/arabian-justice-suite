import { useState } from 'react';
import { Plus, Eye, Edit, FileText, Calendar, User } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { cases, lawyers, clients } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const statusStyles: Record<string, { className: string }> = {
  'جديدة': { className: 'bg-blue-100 text-blue-700' },
  'قيد المراجعة': { className: 'bg-warning/20 text-warning' },
  'في المحكمة': { className: 'bg-success/20 text-success' },
  'مغلقة': { className: 'bg-muted text-muted-foreground' },
};

export default function AdminCasesPage() {
  const { toast } = useToast();
  const [selectedCase, setSelectedCase] = useState<typeof cases[0] | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const columns = [
    {
      key: 'caseNumber' as const,
      label: 'Case #',
      render: (c: typeof cases[0]) => (
        <span className="font-mono text-sm text-secondary">{c.caseNumber}</span>
      ),
    },
    { key: 'type' as const, label: 'Type' },
    {
      key: 'clientName' as const,
      label: 'Client',
      render: (c: typeof cases[0]) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span>{c.clientName}</span>
        </div>
      ),
    },
    { key: 'lawyerName' as const, label: 'Lawyer' },
    {
      key: 'status' as const,
      label: 'Status',
      render: (c: typeof cases[0]) => (
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          statusStyles[c.status]?.className
        )}>
          {c.status}
        </span>
      ),
    },
    {
      key: 'nextSession' as const,
      label: 'Next Session',
      render: (c: typeof cases[0]) => (
        c.nextSession ? (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-secondary" />
            <span>{c.nextSession}</span>
          </div>
        ) : <span className="text-muted-foreground">—</span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Cases Management</h2>
            <p className="text-muted-foreground">Manage all legal cases</p>
          </div>
          <Button variant="gold" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            New Case
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(statusStyles).map(([status, { className }]) => {
            const count = cases.filter(c => c.status === status).length;
            return (
              <div key={status} className="bg-card rounded-xl p-4 shadow-md border border-border/50">
                <div className="flex items-center justify-between">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", className)}>
                    {status}
                  </span>
                  <span className="text-2xl font-bold text-foreground">{count}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Table */}
        <DataTable
          data={cases}
          columns={columns}
          searchPlaceholder="Search cases..."
          onRowClick={(c) => {
            setSelectedCase(c);
            setViewDialogOpen(true);
          }}
          actions={(c) => (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => {
                setSelectedCase(c);
                setViewDialogOpen(true);
              }}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          )}
        />

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Case Details</DialogTitle>
            </DialogHeader>
            {selectedCase && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{selectedCase.caseNumber}</p>
                    <h3 className="text-xl font-bold text-foreground">{selectedCase.type}</h3>
                  </div>
                  <span className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium",
                    statusStyles[selectedCase.status]?.className
                  )}>
                    {selectedCase.status}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <Label className="text-xs text-muted-foreground">Client</Label>
                    <p className="font-medium mt-1">{selectedCase.clientName}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <Label className="text-xs text-muted-foreground">Lawyer</Label>
                    <p className="font-medium mt-1">{selectedCase.lawyerName}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <Label className="text-xs text-muted-foreground">Created</Label>
                    <p className="font-medium mt-1">{selectedCase.createdAt}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <Label className="text-xs text-muted-foreground">Next Session</Label>
                    <p className="font-medium mt-1 text-secondary">{selectedCase.nextSession || '—'}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="mt-1 text-sm">{selectedCase.description}</p>
                </div>

                {/* Timeline */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-3 block">Timeline</Label>
                  <div className="space-y-3">
                    {selectedCase.timeline.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-secondary" />
                          {index < selectedCase.timeline.length - 1 && (
                            <div className="w-0.5 flex-1 bg-border mt-1" />
                          )}
                        </div>
                        <div className="pb-3">
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                          <p className="text-sm font-medium">{item.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-3 block">Documents</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedCase.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                        <FileText className="w-4 h-4 text-secondary" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Case</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Case Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="criminal">قضية جنائية</SelectItem>
                    <SelectItem value="family">قضية أحوال شخصية</SelectItem>
                    <SelectItem value="commercial">قضية تجارية</SelectItem>
                    <SelectItem value="real-estate">قضية عقارية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assigned Lawyer</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lawyer" />
                  </SelectTrigger>
                  <SelectContent>
                    {lawyers.map((lawyer) => (
                      <SelectItem key={lawyer.id} value={lawyer.id}>{lawyer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Case description..." rows={4} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="gold" className="flex-1" onClick={() => {
                  toast({ title: "Case Created Successfully" });
                  setCreateDialogOpen(false);
                }}>
                  Create Case
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
