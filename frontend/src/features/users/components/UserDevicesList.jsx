// استيراد خطافات রيأكت كويري المسؤولة عن التخزين المؤقت وتحديث البيانات
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// استيراد خدمة إرسال الطلبات للباك إند الخاصة بأجهزة العميل
import userService from '../services/userService';
// استيراد مكون الهيكل الرمادي (Skeleton) الذي يظهر أثناء التحميل لجمالية الواجهة
import SkeletonLoader from '@/components/common/SkeletonLoader';
// استيراد مكون الرسالة الفارغة في حال لم تكن هناك أجهزة
import EmptyState from '@/components/common/EmptyState';
// أداة فورمات (تنسيق) التاريخ ليكون مقروءاً
import { formatDateTime } from '@/utils/formatDate';
// زر مخصص من النظام الخاص بك
import Button from '@/components/common/Button';
// استيراد أداة التنبيهات المنبثقة
import toast from 'react-hot-toast';

// المكون الأساسي لعرض أجهزة المستخدم
export default function UserDevicesList({ userId }) {
  // تفعيل مدير التخزين المؤقت لتجديد البيانات متى ما دعت الحاجة
  const queryClient = useQueryClient();

  // جلب البيانات بذكاء باستخدام React Query لمنع تكرار التحميل عند فتح النافذة مجدداً
  const { data: devices = [], isLoading } = useQuery({
    // مفتاح فريد لهذه العملية يتضمن المعرف لضمان عدم الخلط بين العملاء
    queryKey: ['user-devices', userId],
    // الدالة التي تلبي طلب جلب الأجهزة من خدمة userService
    queryFn: () => userService.getUserDevices(userId),
    // لا تقم بإرسال الطلب إطلاقاً إن لم يكن هناك معرف مستخدم (userId) متوفر
    enabled: !!userId,
  });

  // خطاف إرسال طلب سحب / إزالة الجهاز (Revoke) مع التعامل الآلي مع تحديث الجدول
  const revokeMutation = useMutation({
    // استدعاء دالة الباك إند المخصصة لإزالة الجهاز
    mutationFn: (deviceId) => userService.revokeDevice(deviceId),
    // بمجرد نجاح العملية، نحدث الجدول بصمت بالخلفية
    onSuccess: () => {
      // إخبار React Query بأن البيانات القديمة أصبحت غير صالحة وتحتاج لجلب من جديد تلقائياً
      queryClient.invalidateQueries({ queryKey: ['user-devices', userId] });
      toast.success('تمت إزالة الجهاز بنجاح!');
    },
    // في حال فشل الاتصال نعلم المستخدم بذلك
    onError: () => {
      toast.error('حدث خطأ أثناء إزالة الجهاز.');
    }
  });

  // إذا كنا في حالة الانتظار وجلب البيانات لأول مرة، نعرض الأنيميشن
  if (isLoading) return <SkeletonLoader rows={3} />;
  
  // إذا اكتمل التحميل لكن المصفوفة فارغة، نعرض حالة الفراغ
  if (!devices.length) return <EmptyState icon="💻" title="لا توجد أجهزة مسجلة حالياً (No devices registered)" />;

  return (
    // مسافة عمودية بين كل جهاز واللوحة الجمالية
    <div className="space-y-3">
      {/* عملية تدوير (Map) لجميع الأجهزة القادمة من الباك إند */}
      {devices.map((d) => (
        <div key={d.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
          <div>
            {/* عرض اسم الجهاز أو نوعه بخط غامق */}
            <p className="font-medium text-slate-800">{d.device_name || d.device_type || 'Unknown Device'}</p>
            {/* عرض آخر ظهور للجهاز وتنسيقه ليصبح بلغة يفهمها الإنسان */}
            <p className="text-xs text-slate-500">آخر ظهور (Last seen): {formatDateTime(d.last_seen)}</p>
            {/* عرض عنوان الـ IP الذي دخل منه */}
            <p className="text-xs text-slate-400">{d.ip_address}</p>
          </div>
          {/* زر سحب الصلاحية (Revoke) بلون أحمر التحذيري */}
          <Button 
            variant="danger" 
            size="xs" 
            // تشغيل دالة הסر במצב של (Pending) لمنع النقرات المزدوجة
            disabled={revokeMutation.isPending}
            onClick={() => revokeMutation.mutate(d.id)}
          >
            {revokeMutation.isPending ? 'جاري السحب...' : 'إلغاء الصلاحية (Revoke)'}
          </Button>
        </div>
      ))}
    </div>
  );
}
