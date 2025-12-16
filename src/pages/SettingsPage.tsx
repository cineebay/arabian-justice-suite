import { useEffect, useState } from 'react';
import { Building, Clock, Phone, Save } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { officeLawyer } from '@/data/mockData';

export default function SettingsPage() {
  const { toast } = useToast();
  
  const defaultOfficeInfo = {
    name: 'مكتب الأستاذ محمد سعيد فائز للمحاماة',
    nameEn: 'Cabinet Maître Said Faiz',
    address: 'زاكورة، المغرب',
    phone: '+212 528 847 123',
    mobile: '+212 661 234 567',
    email: 'cabinet.faiz.zagora@gmail.com',
    website: 'www.cabinet-faiz.ma',
    barNumber: 'محامي مقيد بهيئة المحامين بمراكش',
  };

  const defaultWorkingHours = {
    weekdays: '09:00 - 18:00',
    saturday: '09:00 - 13:00',
    sunday: 'مغلق',
  };

  const [officeInfo, setOfficeInfo] = useState(defaultOfficeInfo);
  const [workingHours, setWorkingHours] = useState(defaultWorkingHours);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedOfficeInfo = localStorage.getItem('officeSettings');
    const storedWorkingHours = localStorage.getItem('workingHours');

    if (storedOfficeInfo) {
      try {
        setOfficeInfo(JSON.parse(storedOfficeInfo));
      } catch (error) {
        console.error('Failed to parse office settings', error);
      }
    }

    if (storedWorkingHours) {
      try {
        setWorkingHours(JSON.parse(storedWorkingHours));
      } catch (error) {
        console.error('Failed to parse working hours', error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('officeSettings', JSON.stringify(officeInfo));
    localStorage.setItem('workingHours', JSON.stringify(workingHours));

    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تحديث معلومات المكتب بنجاح",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">إعدادات المكتب</h2>
            <p className="text-muted-foreground">تعديل معلومات المكتب وساعات العمل</p>
          </div>
          <Button variant="gold" onClick={handleSave}>
            <Save className="w-4 h-4" />
            حفظ التغييرات
          </Button>
        </div>


        {/* Office Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-secondary" />
              معلومات المكتب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم المكتب (عربي)</Label>
                <Input 
                  value={officeInfo.name}
                  onChange={(e) => setOfficeInfo({ ...officeInfo, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>اسم المكتب (فرنسي)</Label>
                <Input 
                  value={officeInfo.nameEn}
                  onChange={(e) => setOfficeInfo({ ...officeInfo, nameEn: e.target.value })}
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>رقم القيد بهيئة المحامين</Label>
              <Input 
                value={officeInfo.barNumber}
                onChange={(e) => setOfficeInfo({ ...officeInfo, barNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>العنوان</Label>
              <Textarea 
                value={officeInfo.address}
                onChange={(e) => setOfficeInfo({ ...officeInfo, address: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-secondary" />
              معلومات الاتصال
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الهاتف الثابت</Label>
                <Input 
                  value={officeInfo.phone}
                  onChange={(e) => setOfficeInfo({ ...officeInfo, phone: e.target.value })}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>الهاتف المحمول</Label>
                <Input 
                  value={officeInfo.mobile}
                  onChange={(e) => setOfficeInfo({ ...officeInfo, mobile: e.target.value })}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input 
                  value={officeInfo.email}
                  onChange={(e) => setOfficeInfo({ ...officeInfo, email: e.target.value })}
                  dir="ltr"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label>الموقع الإلكتروني</Label>
                <Input 
                  value={officeInfo.website}
                  onChange={(e) => setOfficeInfo({ ...officeInfo, website: e.target.value })}
                  dir="ltr"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              ساعات العمل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>الاثنين - الجمعة</Label>
                <Input 
                  value={workingHours.weekdays}
                  onChange={(e) => setWorkingHours({ ...workingHours, weekdays: e.target.value })}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>السبت</Label>
                <Input 
                  value={workingHours.saturday}
                  onChange={(e) => setWorkingHours({ ...workingHours, saturday: e.target.value })}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>الأحد</Label>
                <Input 
                  value={workingHours.sunday}
                  onChange={(e) => setWorkingHours({ ...workingHours, sunday: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lawyer Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-secondary" />
              معلومات المحامي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-secondary">{officeLawyer.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{officeLawyer.name}</h3>
                <p className="text-secondary">{officeLawyer.specialty}</p>
                <p className="text-sm text-muted-foreground mt-1">{officeLawyer.experience} سنة خبرة</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted/30 rounded-xl">
              <Label className="text-xs text-muted-foreground">نبذة عن المحامي</Label>
              <p className="text-sm mt-1">{officeLawyer.bio}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
