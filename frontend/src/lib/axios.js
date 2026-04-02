import axios from 'axios';

// إنشاء نسخة مخصصة من المفاوض (Axios Instance)
// للتواصل الدائم مع الباك إند المركزي الخاص بمشروعك (Laravel)
export const api = axios.create({
  // تحديد رابط الـ API الأساسي، سيتم تغييره لاحقاً إذا رفعناه على استضافة
  baseURL: 'http://localhost:8000/api',
  // ضبط الرؤوس الأساسية لقبول وإرسال بيانات من نوع JSON
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// إضافة معرّض للطلبات (Interceptor) لزرع التوكن في كل طلب
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// التعامل مع أخطاء الـ Token منتهي الصلاحية (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('auth_token');
      // تحويل المستخدم لصفحة الدخول إذا رغبت
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
