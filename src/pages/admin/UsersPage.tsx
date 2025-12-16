import { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { clients } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminUsersPage() {
  const [selectedUser, setSelectedUser] = useState<typeof clients[0] | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const columns = [
    {
      key: 'name' as const,
      label: 'Client Name',
      render: (client: typeof clients[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-secondary">{client.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-foreground">{client.name}</p>
            <p className="text-xs text-muted-foreground">{client.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone' as const,
      label: 'Phone',
      render: (client: typeof clients[0]) => (
        <span dir="ltr" className="text-muted-foreground">{client.phone}</span>
      ),
    },
    {
      key: 'casesCount' as const,
      label: 'Cases',
      render: (client: typeof clients[0]) => (
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
          {client.casesCount} cases
        </span>
      ),
    },
    {
      key: 'appointmentsCount' as const,
      label: 'Appointments',
      render: (client: typeof clients[0]) => (
        <span className="text-muted-foreground">{client.appointmentsCount}</span>
      ),
    },
    {
      key: 'createdAt' as const,
      label: 'Joined',
      render: (client: typeof clients[0]) => (
        <span className="text-muted-foreground">{client.createdAt}</span>
      ),
    },
  ];

  const handleView = (client: typeof clients[0]) => {
    setSelectedUser(client);
    setViewDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Users Management</h2>
            <p className="text-muted-foreground">Manage your client database</p>
          </div>
          <Button variant="gold">
            <Plus className="w-4 h-4" />
            Add Client
          </Button>
        </div>

        {/* Data Table */}
        <DataTable
          data={clients}
          columns={columns}
          searchPlaceholder="Search clients..."
          actions={(client) => (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleView(client)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        />

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Client Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-secondary">{selectedUser.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">Client since {selectedUser.createdAt}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-secondary" />
                      <span className="text-sm">{selectedUser.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-secondary" />
                      <span className="text-sm" dir="ltr">{selectedUser.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-secondary">{selectedUser.casesCount}</p>
                    <p className="text-sm text-muted-foreground">Total Cases</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-secondary">{selectedUser.appointmentsCount}</p>
                    <p className="text-sm text-muted-foreground">Appointments</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="gold" className="flex-1">View Cases</Button>
                  <Button variant="outline" className="flex-1">View Appointments</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
