import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// زرع التوكن في كل طلب
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ───────────────────────────────────────────────────────────────────────
// Response Interceptor — يفك تغليف Laravel مرة واحدة لكل الفيتشرز
//
// كل استجابة باك إند تأتي بهذا الشكل:
//   { success: true, message: '...', data: <البيانات> }
//
// بعد هذا الفك:
//   useQuery data → البيانات مباشرة (بدون حاجة لـ .data، .data.data)
//
// مثال: مستندات→ data = { items:[...], pagination:{...} }
//          تفاصيل → data = { id, title, ... }
//          الوصول → data = [ { id, name, ... }, ... ]
// ───────────────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    // إذا كان responseType: 'blob' (تصدير CSV/PDF) — لا تفك التغليف
    if (response.config?.responseType === 'blob') {
      return response;
    }

    const body = response.data;

    // إذا كان هيكل Laravel ({ success, data }) — ارجع البيانات مباشرة
    if (body && typeof body === 'object' && 'data' in body) {
      return body.data;
    }

    // فول باك — ارجع كما هو
    return body;
  },
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      sessionStorage.removeItem('auth_token');
      // توجيه المستخدم لصفحة الدخول إذا انتهت الجلسة لمنع الأخطاء الوهمية
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
