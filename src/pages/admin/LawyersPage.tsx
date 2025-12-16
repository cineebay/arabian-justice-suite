import { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Star, Briefcase } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { lawyers } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function AdminLawyersPage() {
  const { toast } = useToast();
  const [selectedLawyer, setSelectedLawyer] = useState<typeof lawyers[0] | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const columns = [
    {
      key: 'name' as const,
      label: 'Lawyer',
      render: (lawyer: typeof lawyers[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
            <span className="text-sm font-bold text-secondary-foreground">{lawyer.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-foreground">{lawyer.name}</p>
            <p className="text-xs text-muted-foreground">{lawyer.nameEn}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'specialty' as const,
      label: 'Specialty',
      render: (lawyer: typeof lawyers[0]) => (
        <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
          {lawyer.specialty}
        </span>
      ),
    },
    {
      key: 'experience' as const,
      label: 'Experience',
      render: (lawyer: typeof lawyers[0]) => (
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          <span>{lawyer.experience} years</span>
        </div>
      ),
    },
    {
      key: 'cases' as const,
      label: 'Cases',
      render: (lawyer: typeof lawyers[0]) => (
        <span className="font-medium">{lawyer.cases}</span>
      ),
    },
    {
      key: 'rating' as const,
      label: 'Rating',
      render: (lawyer: typeof lawyers[0]) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-secondary text-secondary" />
          <span className="font-medium">{lawyer.rating}</span>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Lawyers Management</h2>
            <p className="text-muted-foreground">Manage your legal team</p>
          </div>
          <Button variant="gold" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Lawyer
          </Button>
        </div>

        {/* Lawyers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="bg-card rounded-xl p-6 shadow-md border border-border/50 hover:border-secondary/50 transition-all cursor-pointer"
              onClick={() => {
                setSelectedLawyer(lawyer);
                setViewDialogOpen(true);
              }}
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-gold flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-secondary-foreground">{lawyer.name.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-foreground">{lawyer.name}</h3>
                <p className="text-sm text-secondary mt-1">{lawyer.specialty}</p>
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span>{lawyer.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{lawyer.experience}y</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Table */}
        <DataTable
          data={lawyers}
          columns={columns}
          searchPlaceholder="Search lawyers..."
          onRowClick={(lawyer) => {
            setSelectedLawyer(lawyer);
            setViewDialogOpen(true);
          }}
          actions={(lawyer) => (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => {
                setSelectedLawyer(lawyer);
                setViewDialogOpen(true);
              }}>
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
              <DialogTitle>Lawyer Details</DialogTitle>
            </DialogHeader>
            {selectedLawyer && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-gold flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-secondary-foreground">{selectedLawyer.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{selectedLawyer.name}</h3>
                  <p className="text-secondary">{selectedLawyer.specialty}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-secondary">{selectedLawyer.cases}</p>
                    <p className="text-xs text-muted-foreground">Cases</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-secondary">{selectedLawyer.experience}</p>
                    <p className="text-xs text-muted-foreground">Years</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 fill-secondary text-secondary" />
                      <span className="text-2xl font-bold text-secondary">{selectedLawyer.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Bio</Label>
                  <p className="text-sm mt-1">{selectedLawyer.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="text-sm mt-1">{selectedLawyer.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <p className="text-sm mt-1" dir="ltr">{selectedLawyer.phone}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="gold" className="flex-1">View Cases</Button>
                  <Button variant="outline" className="flex-1">Edit Profile</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Lawyer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name (Arabic)</Label>
                  <Input placeholder="الاسم بالعربي" />
                </div>
                <div className="space-y-2">
                  <Label>Name (English)</Label>
                  <Input placeholder="Name in English" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Specialty</Label>
                <Input placeholder="e.g., Criminal Law" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Experience (years)</Label>
                  <Input type="number" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input type="tel" placeholder="+966..." dir="ltr" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="lawyer@lawfirm.com" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea placeholder="Lawyer bio..." rows={3} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="gold" className="flex-1" onClick={() => {
                  toast({ title: "Lawyer Added Successfully" });
                  setCreateDialogOpen(false);
                }}>
                  Add Lawyer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
