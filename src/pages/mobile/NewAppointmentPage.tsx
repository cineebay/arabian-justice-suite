import { useState } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle } from 'lucide-react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { services, lawyers } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export default function NewAppointmentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    lawyer: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    description: '',
  });

  const handleSubmit = () => {
    toast({
      title: "تم حجز الموعد بنجاح!",
      description: "سيتم التواصل معك قريباً لتأكيد الموعد",
    });
    setStep(4); // Success step
  };

  if (step === 4) {
    return (
      <MobileLayout title="تأكيد الحجز" showBack>
        <div className="px-5 py-12 text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">تم الحجز بنجاح!</h2>
          <p className="text-muted-foreground mb-8">
            شكراً لك، سيتم التواصل معك قريباً لتأكيد موعدك
          </p>
          <div className="bg-card rounded-xl p-5 text-right mb-8 shadow-md border border-border/50">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">الخدمة:</span>
                <span className="font-medium">{services.find(s => s.id === formData.service)?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">المحامي:</span>
                <span className="font-medium">{lawyers.find(l => l.id === formData.lawyer)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">التاريخ:</span>
                <span className="font-medium">{formData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الوقت:</span>
                <span className="font-medium">{formData.time}</span>
              </div>
            </div>
          </div>
          <Button variant="gold" size="lg" className="w-full" onClick={() => navigate('/')}>
            العودة للرئيسية
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="حجز موعد جديد" showBack>
      <div className="px-5 py-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                step >= s ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {s}
              </div>
              {s < 3 && (
                <div className={cn(
                  "w-16 h-1 mx-2 rounded transition-all",
                  step > s ? "bg-secondary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Service & Lawyer */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-foreground">اختر الخدمة والمحامي</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">نوع الخدمة</label>
              <Select value={formData.service} onValueChange={(v) => setFormData({...formData, service: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">المحامي</label>
              <Select value={formData.lawyer} onValueChange={(v) => setFormData({...formData, lawyer: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المحامي" />
                </SelectTrigger>
                <SelectContent>
                  {lawyers.map((lawyer) => (
                    <SelectItem key={lawyer.id} value={lawyer.id}>
                      {lawyer.name} - {lawyer.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="gold" 
              size="lg" 
              className="w-full mt-8"
              onClick={() => setStep(2)}
              disabled={!formData.service || !formData.lawyer}
            >
              التالي
            </Button>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-foreground">اختر الموعد</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">التاريخ</label>
              <Input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">الوقت</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setFormData({...formData, time})}
                    className={cn(
                      "py-3 rounded-lg text-sm font-medium transition-all",
                      formData.time === time
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
                السابق
              </Button>
              <Button 
                variant="gold" 
                size="lg" 
                className="flex-1"
                onClick={() => setStep(3)}
                disabled={!formData.date || !formData.time}
              >
                التالي
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Personal Info */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-foreground">بياناتك الشخصية</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">الاسم الكامل</label>
              <Input 
                placeholder="أدخل اسمك الكامل"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">رقم الهاتف</label>
              <Input 
                type="tel"
                placeholder="05xxxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
              <label className="text-sm font-medium text-foreground">وصف القضية (اختياري)</label>
              <Textarea 
                placeholder="صف قضيتك باختصار..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
              />
            </div>

            <div className="flex gap-3 mt-8">
              <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(2)}>
                السابق
              </Button>
              <Button 
                variant="gold" 
                size="lg" 
                className="flex-1"
                onClick={handleSubmit}
                disabled={!formData.name || !formData.phone}
              >
                تأكيد الحجز
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
