import { useState } from 'react';
import { MessageCircle, Upload, CheckCircle, FileText, X } from 'lucide-react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const consultationTypes = [
  'استشارة جنائية',
  'استشارة أسرية',
  'استشارة تجارية',
  'استشارة عقارية',
  'استشارة عمالية',
  'استشارة أخرى',
];

export default function ConsultationPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    type: '',
    details: '',
    name: '',
    phone: '',
    email: '',
  });

  const handleFileUpload = () => {
    // Simulate file upload
    setFiles([...files, `document_${files.length + 1}.pdf`]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    toast({
      title: "تم إرسال طلب الاستشارة",
      description: "سيتواصل معك أحد محامينا قريباً",
    });
    setStep(5);
  };

  if (step === 5) {
    return (
      <MobileLayout title="طلب استشارة" showBack>
        <div className="px-5 py-12 text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">تم إرسال طلبك!</h2>
          <p className="text-muted-foreground mb-8">
            شكراً لك، سيقوم أحد محامينا بمراجعة طلبك والتواصل معك خلال 24 ساعة
          </p>
          <Button variant="gold" size="lg" className="w-full" onClick={() => navigate('/')}>
            العودة للرئيسية
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="طلب استشارة قانونية" showBack>
      <div className="px-5 py-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                step >= s ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {s}
              </div>
              {s < 4 && (
                <div className={cn(
                  "w-10 h-1 mx-1 rounded transition-all",
                  step > s ? "bg-secondary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Type */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">نوع الاستشارة</h2>
              <p className="text-sm text-muted-foreground mt-2">اختر نوع الاستشارة القانونية</p>
            </div>

            <div className="space-y-3">
              {consultationTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({...formData, type})}
                  className={cn(
                    "w-full p-4 rounded-xl text-right transition-all border",
                    formData.type === type
                      ? "bg-secondary/10 border-secondary"
                      : "bg-card border-border hover:border-secondary/50"
                  )}
                >
                  <span className={cn(
                    "font-medium",
                    formData.type === type ? "text-secondary" : "text-foreground"
                  )}>
                    {type}
                  </span>
                </button>
              ))}
            </div>

            <Button 
              variant="gold" 
              size="lg" 
              className="w-full mt-8"
              onClick={() => setStep(2)}
              disabled={!formData.type}
            >
              التالي
            </Button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-foreground">تفاصيل القضية</h2>
            <p className="text-sm text-muted-foreground">اشرح قضيتك أو استفسارك بالتفصيل</p>
            
            <Textarea 
              placeholder="اكتب تفاصيل قضيتك هنا... كلما كانت المعلومات أكثر، كانت الاستشارة أدق."
              value={formData.details}
              onChange={(e) => setFormData({...formData, details: e.target.value})}
              rows={8}
              className="resize-none"
            />

            <div className="flex gap-3 mt-8">
              <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
                السابق
              </Button>
              <Button 
                variant="gold" 
                size="lg" 
                className="flex-1"
                onClick={() => setStep(3)}
                disabled={!formData.details}
              >
                التالي
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Files */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-foreground">المرفقات (اختياري)</h2>
            <p className="text-sm text-muted-foreground">أرفق أي مستندات متعلقة بقضيتك</p>
            
            <button
              onClick={handleFileUpload}
              className="w-full p-8 border-2 border-dashed border-border rounded-xl text-center hover:border-secondary/50 transition-colors"
            >
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">اضغط لرفع الملفات</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (حد أقصى 10MB)</p>
            </button>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-secondary" />
                      <span className="text-sm">{file}</span>
                    </div>
                    <button onClick={() => removeFile(index)} className="text-muted-foreground hover:text-destructive">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(2)}>
                السابق
              </Button>
              <Button 
                variant="gold" 
                size="lg" 
                className="flex-1"
                onClick={() => setStep(4)}
              >
                التالي
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Personal Info */}
        {step === 4 && (
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

            <div className="flex gap-3 mt-8">
              <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(3)}>
                السابق
              </Button>
              <Button 
                variant="gold" 
                size="lg" 
                className="flex-1"
                onClick={handleSubmit}
                disabled={!formData.name || !formData.phone}
              >
                إرسال الطلب
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
