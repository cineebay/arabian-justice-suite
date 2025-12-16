import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم إرسال رسالتك بنجاح",
      description: "سنتواصل معك في أقرب وقت",
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <MobileLayout title="تواصل معنا" showBack>
        <div className="px-5 py-12 text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">شكراً لتواصلك!</h2>
          <p className="text-muted-foreground mb-8">
            تم استلام رسالتك بنجاح وسنتواصل معك قريباً
          </p>
          <Button variant="gold" size="lg" onClick={() => setSubmitted(false)}>
            إرسال رسالة أخرى
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="تواصل معنا" showBack>
      <div className="animate-fade-in">
        {/* Contact Info */}
        <div className="bg-gradient-navy px-5 py-6">
          <h2 className="text-lg font-bold text-primary-foreground mb-4">معلومات التواصل</h2>
          <div className="space-y-4">
            <a href="tel:+966501234567" className="flex items-center gap-4 text-primary-foreground hover:text-gold-light transition-colors">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-gold-light">الهاتف</p>
                <p dir="ltr" className="text-sm">+966 50 123 4567</p>
              </div>
            </a>
            <a href="mailto:info@lawfirm.com" className="flex items-center gap-4 text-primary-foreground hover:text-gold-light transition-colors">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-gold-light">البريد الإلكتروني</p>
                <p dir="ltr" className="text-sm">info@lawfirm.com</p>
              </div>
            </a>
            <div className="flex items-center gap-4 text-primary-foreground">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-gold-light">العنوان</p>
                <p className="text-sm">الرياض، حي العليا، شارع الملك فهد</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-primary-foreground">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-gold-light">ساعات العمل</p>
                <p className="text-sm">الأحد - الخميس: 9:00 ص - 5:00 م</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="px-5 py-6">
          <h2 className="text-lg font-bold text-foreground mb-4">أرسل رسالة</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">الاسم الكامل</label>
              <Input
                placeholder="أدخل اسمك"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">رقم الهاتف</label>
              <Input
                type="tel"
                placeholder="05xxxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">البريد الإلكتروني</label>
              <Input
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">الرسالة</label>
              <Textarea
                placeholder="اكتب رسالتك هنا..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={5}
                required
              />
            </div>
            <Button type="submit" variant="gold" size="lg" className="w-full">
              <Send className="w-5 h-5" />
              إرسال الرسالة
            </Button>
          </form>
        </div>

        {/* WhatsApp */}
        <div className="px-5 pb-6">
          <a
            href="https://wa.me/966501234567"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#22c55e] transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            تواصل عبر واتساب
          </a>
        </div>
      </div>
    </MobileLayout>
  );
}
