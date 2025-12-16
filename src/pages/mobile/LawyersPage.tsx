import { useState } from 'react';
import { Search, Star, Briefcase, Phone, Mail, Calendar } from 'lucide-react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { LawyerCard } from '@/components/mobile/LawyerCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { lawyers, Lawyer } from '@/data/mockData';
import { useParams, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function LawyersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLawyers = lawyers.filter(lawyer =>
    lawyer.name.includes(searchQuery) ||
    lawyer.specialty.includes(searchQuery)
  );

  return (
    <MobileLayout title="فريق المحامين" showBack>
      <div className="px-5 py-4">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="ابحث عن محامي..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Lawyers List */}
        <div className="space-y-4">
          {filteredLawyers.map((lawyer, index) => (
            <LawyerCard
              key={lawyer.id}
              lawyer={lawyer}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredLawyers.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">لا توجد نتائج</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

export function LawyerDetailPage() {
  const { id } = useParams();
  const lawyer = lawyers.find(l => l.id === id);

  if (!lawyer) {
    return (
      <MobileLayout title="المحامي" showBack>
        <div className="px-5 py-12 text-center">
          <p className="text-muted-foreground">لم يتم العثور على المحامي</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title={lawyer.name} showBack>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-navy px-5 py-8 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-gold overflow-hidden mb-4">
            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-secondary">
              {lawyer.name.charAt(0)}
            </div>
          </div>
          <h1 className="text-xl font-bold text-primary-foreground mb-1">{lawyer.name}</h1>
          <p className="text-gold-light">{lawyer.specialty}</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1 text-primary-foreground">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="text-sm">{lawyer.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-primary-foreground">
              <Briefcase className="w-4 h-4 text-gold-light" />
              <span className="text-sm">{lawyer.experience} سنة خبرة</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-6">
          {/* Bio */}
          <div className="bg-card rounded-xl p-5 shadow-md border border-border/50 mb-6">
            <h2 className="font-bold text-foreground mb-3">نبذة عن المحامي</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{lawyer.bio}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-card rounded-xl p-5 text-center shadow-md border border-border/50">
              <p className="text-3xl font-bold text-secondary">{lawyer.cases}</p>
              <p className="text-sm text-muted-foreground">قضية منجزة</p>
            </div>
            <div className="bg-card rounded-xl p-5 text-center shadow-md border border-border/50">
              <p className="text-3xl font-bold text-secondary">{lawyer.experience}</p>
              <p className="text-sm text-muted-foreground">سنة خبرة</p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-card rounded-xl p-5 shadow-md border border-border/50 mb-6">
            <h2 className="font-bold text-foreground mb-4">معلومات التواصل</h2>
            <div className="space-y-3">
              <a href={`tel:${lawyer.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-5 h-5 text-secondary" />
                <span dir="ltr">{lawyer.phone}</span>
              </a>
              <a href={`mailto:${lawyer.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-5 h-5 text-secondary" />
                <span dir="ltr">{lawyer.email}</span>
              </a>
            </div>
          </div>

          {/* Book Appointment */}
          <Link to={`/appointments/new?lawyer=${lawyer.id}`}>
            <Button variant="gold" size="lg" className="w-full">
              <Calendar className="w-5 h-5" />
              حجز موعد مع المحامي
            </Button>
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
}
