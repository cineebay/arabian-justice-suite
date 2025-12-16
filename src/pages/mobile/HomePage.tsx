import { Calendar, MessageCircle, FileText, Briefcase, Users, Phone } from 'lucide-react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { QuickAction } from '@/components/mobile/QuickAction';
import { SectionHeader } from '@/components/mobile/SectionHeader';
import { ServiceCard } from '@/components/mobile/ServiceCard';
import { LawyerCard } from '@/components/mobile/LawyerCard';
import { Button } from '@/components/ui/button';
import { services, lawyers } from '@/data/mockData';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <MobileLayout>
      {/* Hero Banner */}
      <section className="relative bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-4 border-secondary rounded-full" />
          <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-secondary/50 rounded-full" />
        </div>
        <div className="relative px-5 py-8 text-primary-foreground">
          <h2 className="text-2xl font-bold mb-2">خيارك الأول في التمثيل القانوني</h2>
          <p className="text-gold-light text-sm mb-4 leading-relaxed">
            شركة محاماة واستشارات قانونية مرخّصة في المملكة العربية السعودية
          </p>
          <Link to="/consultation">
            <Button variant="gold" size="lg" className="w-full">
              <MessageCircle className="w-5 h-5" />
              اطلب استشارة الآن
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-5 py-6">
        <SectionHeader title="خدمات سريعة" />
        <div className="grid grid-cols-3 gap-3">
          <QuickAction to="/appointments/new" icon={Calendar} label="حجز موعد" />
          <QuickAction to="/consultation" icon={MessageCircle} label="استشارة" />
          <QuickAction to="/track-case" icon={FileText} label="تتبّع ملف" />
          <QuickAction to="/services" icon={Briefcase} label="الخدمات" />
          <QuickAction to="/lawyers" icon={Users} label="المحامون" />
          <QuickAction to="/contact" icon={Phone} label="تواصل" />
        </div>
      </section>

      {/* Services */}
      <section className="px-5 py-4">
        <SectionHeader title="الخدمات القانونية" linkTo="/services" />
        <div className="space-y-3">
          {services.slice(0, 3).map((service, index) => (
            <ServiceCard
              key={service.id}
              {...service}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </section>

      {/* Lawyers Carousel */}
      <section className="py-6">
        <div className="px-5">
          <SectionHeader title="فريق المحامين" linkTo="/lawyers" />
        </div>
        <div className="flex gap-4 overflow-x-auto px-5 pb-2 custom-scrollbar">
          {lawyers.map((lawyer) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} variant="compact" />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-5 py-6 mb-4">
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 text-center">
          <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">هل تحتاج مساعدة قانونية؟</h3>
          <p className="text-sm text-muted-foreground mb-4">
            فريقنا من المحامين المتخصصين جاهز لخدمتك على مدار الساعة
          </p>
          <div className="flex gap-3">
            <Link to="/consultation" className="flex-1">
              <Button variant="gold" className="w-full">استشارة مجانية</Button>
            </Link>
            <Link to="/contact" className="flex-1">
              <Button variant="navy-outline" className="w-full">اتصل بنا</Button>
            </Link>
          </div>
        </div>
      </section>
    </MobileLayout>
  );
}
