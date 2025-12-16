import { MobileLayout } from '@/components/mobile/MobileLayout';
import { ServiceCard } from '@/components/mobile/ServiceCard';
import { services } from '@/data/mockData';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Scale, Users, Briefcase, Building, Hammer, MessageCircle, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  scale: Scale,
  users: Users,
  briefcase: Briefcase,
  building: Building,
  hammer: Hammer,
  'message-circle': MessageCircle,
};

export default function ServicesPage() {
  return (
    <MobileLayout title="الخدمات القانونية" showBack>
      <div className="px-5 py-4">
        <p className="text-muted-foreground mb-6">
          نقدم مجموعة شاملة من الخدمات القانونية المتخصصة لتلبية احتياجاتكم
        </p>
        <div className="space-y-4">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              {...service}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}

export function ServiceDetailPage() {
  const { id } = useParams();
  const service = services.find(s => s.id === id);

  if (!service) {
    return (
      <MobileLayout title="الخدمة" showBack>
        <div className="px-5 py-12 text-center">
          <p className="text-muted-foreground">لم يتم العثور على الخدمة</p>
        </div>
      </MobileLayout>
    );
  }

  const Icon = iconMap[service.icon] || Scale;

  return (
    <MobileLayout title={service.title} showBack>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-navy px-5 py-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-secondary/20 flex items-center justify-center mb-4">
            <Icon className="w-10 h-10 text-secondary" />
          </div>
          <h1 className="text-xl font-bold text-primary-foreground">{service.title}</h1>
        </div>

        <div className="px-5 py-6">
          {/* Description */}
          <div className="bg-card rounded-xl p-5 shadow-md border border-border/50 mb-6">
            <h2 className="font-bold text-foreground mb-3">عن الخدمة</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {service.description}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              نقدم لكم في مكتب العدالة للمحاماة خدمات {service.title} بأعلى معايير الجودة والاحترافية. 
              فريقنا من المحامين المتخصصين لديهم خبرة واسعة في هذا المجال وجاهزون لمساعدتكم في جميع 
              الإجراءات القانونية المتعلقة بهذه الخدمة.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-card rounded-xl p-5 shadow-md border border-border/50 mb-6">
            <h2 className="font-bold text-foreground mb-4">ما نقدمه</h2>
            <ul className="space-y-3">
              {[
                'استشارة قانونية متخصصة',
                'إعداد ومراجعة المستندات',
                'التمثيل أمام الجهات المختصة',
                'متابعة الإجراءات القانونية',
                'دعم متواصل حتى إنهاء الإجراءات',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Link to="/appointments/new">
              <Button variant="gold" size="lg" className="w-full">
                <Calendar className="w-5 h-5" />
                احجز موعداً الآن
              </Button>
            </Link>
            <Link to="/consultation">
              <Button variant="navy-outline" size="lg" className="w-full">
                <MessageCircle className="w-5 h-5" />
                اطلب استشارة
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
