import { useState } from 'react';
import { FileText, Search, Calendar, User, Clock, ChevronLeft } from 'lucide-react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cases, Case } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useParams, Link } from 'react-router-dom';

const statusColors: Record<string, { bg: string; text: string }> = {
  'جديدة': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'قيد المراجعة': { bg: 'bg-warning/20', text: 'text-warning' },
  'في المحكمة': { bg: 'bg-success/20', text: 'text-success' },
  'مغلقة': { bg: 'bg-muted', text: 'text-muted-foreground' },
};

export default function CasesPage() {
  return (
    <MobileLayout title="الملفات القضائية" showBack>
      <div className="px-5 py-4">
        {/* Track Case Card */}
        <Link to="/track-case">
          <div className="bg-gradient-navy rounded-xl p-5 mb-6 text-primary-foreground">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <Search className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">تتبّع ملفك</h3>
                <p className="text-sm text-gold-light">أدخل رقم الملف لمتابعة قضيتك</p>
              </div>
              <ChevronLeft className="w-5 h-5 text-gold-light" />
            </div>
          </div>
        </Link>

        {/* My Cases */}
        <h2 className="text-lg font-bold text-foreground mb-4">ملفاتي</h2>
        <div className="space-y-4">
          {cases.map((caseItem, index) => (
            <Link
              key={caseItem.id}
              to={`/cases/${caseItem.id}`}
              className="block bg-card rounded-xl p-5 shadow-md border border-border/50 animate-fade-in hover:border-secondary/50 transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{caseItem.caseNumber}</p>
                  <h3 className="font-bold text-foreground">{caseItem.type}</h3>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  statusColors[caseItem.status]?.bg,
                  statusColors[caseItem.status]?.text
                )}>
                  {caseItem.status}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-secondary" />
                  <span>{caseItem.lawyerName}</span>
                </div>
                {caseItem.nextSession && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span>الجلسة: {caseItem.nextSession}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {cases.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">لا توجد ملفات</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

export function CaseDetailPage() {
  const { id } = useParams();
  const caseItem = cases.find(c => c.id === id);

  if (!caseItem) {
    return (
      <MobileLayout title="تفاصيل الملف" showBack>
        <div className="px-5 py-12 text-center">
          <p className="text-muted-foreground">لم يتم العثور على الملف</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="تفاصيل الملف" showBack>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-navy px-5 py-6">
          <p className="text-xs text-gold-light mb-1">{caseItem.caseNumber}</p>
          <h1 className="text-xl font-bold text-primary-foreground mb-2">{caseItem.type}</h1>
          <span className={cn(
            "inline-block px-3 py-1 rounded-full text-xs font-medium",
            statusColors[caseItem.status]?.bg,
            statusColors[caseItem.status]?.text
          )}>
            {caseItem.status}
          </span>
        </div>

        <div className="px-5 py-6 space-y-6">
          {/* Info */}
          <div className="bg-card rounded-xl p-5 shadow-md border border-border/50">
            <h2 className="font-bold text-foreground mb-4">معلومات الملف</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">المحامي:</span>
                <span className="font-medium">{caseItem.lawyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">تاريخ الفتح:</span>
                <span className="font-medium">{caseItem.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">آخر تحديث:</span>
                <span className="font-medium">{caseItem.updatedAt}</span>
              </div>
              {caseItem.nextSession && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الجلسة القادمة:</span>
                  <span className="font-medium text-secondary">{caseItem.nextSession}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-card rounded-xl p-5 shadow-md border border-border/50">
            <h2 className="font-bold text-foreground mb-3">وصف القضية</h2>
            <p className="text-sm text-muted-foreground">{caseItem.description}</p>
          </div>

          {/* Timeline */}
          <div className="bg-card rounded-xl p-5 shadow-md border border-border/50">
            <h2 className="font-bold text-foreground mb-4">سير القضية</h2>
            <div className="space-y-4">
              {caseItem.timeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    {index < caseItem.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                    <p className="text-sm font-medium">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-card rounded-xl p-5 shadow-md border border-border/50">
            <h2 className="font-bold text-foreground mb-4">المستندات</h2>
            <div className="space-y-2">
              {caseItem.documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <FileText className="w-5 h-5 text-secondary" />
                  <span className="text-sm">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

export function TrackCasePage() {
  const [caseNumber, setCaseNumber] = useState('');
  const [searchedCase, setSearchedCase] = useState<Case | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const found = cases.find(c => c.caseNumber === caseNumber);
    setSearchedCase(found || null);
    setSearched(true);
  };

  return (
    <MobileLayout title="تتبّع ملف" showBack>
      <div className="px-5 py-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">تتبّع ملفك القضائي</h2>
          <p className="text-sm text-muted-foreground">أدخل رقم الملف للاطلاع على تفاصيله</p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="مثال: CASE-2024-001"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            className="text-center"
            dir="ltr"
          />
          <Button variant="gold" size="lg" className="w-full" onClick={handleSearch}>
            <Search className="w-5 h-5" />
            بحث
          </Button>
        </div>

        {searched && !searchedCase && (
          <div className="mt-8 text-center py-8 bg-muted rounded-xl">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">لم يتم العثور على الملف</p>
          </div>
        )}

        {searchedCase && (
          <Link
            to={`/cases/${searchedCase.id}`}
            className="mt-8 block bg-card rounded-xl p-5 shadow-md border border-secondary/50 animate-fade-in"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{searchedCase.caseNumber}</p>
                <h3 className="font-bold text-foreground">{searchedCase.type}</h3>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                statusColors[searchedCase.status]?.bg,
                statusColors[searchedCase.status]?.text
              )}>
                {searchedCase.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">اضغط لعرض التفاصيل</p>
          </Link>
        )}
      </div>
    </MobileLayout>
  );
}
