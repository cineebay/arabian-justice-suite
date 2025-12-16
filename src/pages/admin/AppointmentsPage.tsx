import { useState } from 'react';
import { Plus, Eye, Edit, Check, X, Calendar } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { appointments, lawyers } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const statusStyles: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/20 text-warning' },
  confirmed: { label: 'Confirmed', className: 'bg-success/20 text-success' },
  completed: { label: 'Completed', className: 'bg-primary/20 text-primary' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/20 text-destructive' },
};

export default function AdminAppointmentsPage() {
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const columns = [
    {
      key: 'clientName' as const,
      label: 'Client',
      render: (apt: typeof appointments[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-secondary">{apt.clientName.charAt(0)}</span>
          </div>
          <span className="font-medium">{apt.clientName}</span>
        </div>
      ),
    },
    { key: 'lawyerName' as const, label: 'Lawyer' },
    { key: 'service' as const, label: 'Service' },
    {
      key: 'date' as const,
      label: 'Date & Time',
      render: (apt: typeof appointments[0]) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-secondary" />
          <span>{apt.date} - {apt.time}</span>
        </div>
      ),
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (apt: typeof appointments[0]) => (
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          statusStyles[apt.status].className
        )}>
          {statusStyles[apt.status].label}
        </span>
      ),
    },
  ];

  const handleApprove = (apt: typeof appointments[0]) => {
    toast({
      title: "Appointment Approved",
      description: `Appointment for ${apt.clientName} has been confirmed.`,
    });
  };

  const handleReject = (apt: typeof appointments[0]) => {
    toast({
      title: "Appointment Rejected",
      description: `Appointment for ${apt.clientName} has been cancelled.`,
      variant: "destructive",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Appointments Management</h2>
            <p className="text-muted-foreground">Manage all client appointments</p>
          </div>
          <Button variant="gold" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            New Appointment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(statusStyles).map(([status, { label, className }]) => {
            const count = appointments.filter(a => a.status === status).length;
            return (
              <div key={status} className="bg-card rounded-xl p-4 shadow-md border border-border/50">
                <div className="flex items-center justify-between">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", className)}>
                    {label}
                  </span>
                  <span className="text-2xl font-bold text-foreground">{count}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Table */}
        <DataTable
          data={appointments}
          columns={columns}
          searchPlaceholder="Search appointments..."
          onRowClick={(apt) => {
            setSelectedAppointment(apt);
            setViewDialogOpen(true);
          }}
          actions={(apt) => (
            <div className="flex items-center gap-1">
              {apt.status === 'pending' && (
                <>
                  <Button variant="ghost" size="icon" className="text-success" onClick={() => handleApprove(apt)}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleReject(apt)}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon" onClick={() => {
                setSelectedAppointment(apt);
                setViewDialogOpen(true);
              }}>
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          )}
        />

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Client</Label>
                    <p className="font-medium">{selectedAppointment.clientName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Lawyer</Label>
                    <p className="font-medium">{selectedAppointment.lawyerName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Service</Label>
                    <p className="font-medium">{selectedAppointment.service}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Status</Label>
                    <span className={cn(
                      "inline-block px-3 py-1 rounded-full text-xs font-medium mt-1",
                      statusStyles[selectedAppointment.status].className
                    )}>
                      {statusStyles[selectedAppointment.status].label}
                    </span>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Date</Label>
                    <p className="font-medium">{selectedAppointment.date}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Time</Label>
                    <p className="font-medium">{selectedAppointment.time}</p>
                  </div>
                </div>
                {selectedAppointment.notes && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Notes</Label>
                    <p className="text-sm mt-1">{selectedAppointment.notes}</p>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  {selectedAppointment.status === 'pending' && (
                    <>
                      <Button variant="gold" className="flex-1" onClick={() => handleApprove(selectedAppointment)}>
                        <Check className="w-4 h-4" /> Approve
                      </Button>
                      <Button variant="outline" className="flex-1 text-destructive" onClick={() => handleReject(selectedAppointment)}>
                        <X className="w-4 h-4" /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input placeholder="Enter client name" />
              </div>
              <div className="space-y-2">
                <Label>Lawyer</Label>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Add notes..." rows={3} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="gold" className="flex-1" onClick={() => {
                  toast({ title: "Appointment Created" });
                  setCreateDialogOpen(false);
                }}>
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
