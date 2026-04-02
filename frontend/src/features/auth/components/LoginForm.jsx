import { useState } from 'react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../../lib/axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/saas/login', { email, password });
      
      // حفظ التوكن وبيانات المستخدم في الجلسة (session storage)
      if (response.data?.token) {
        sessionStorage.setItem('auth_token', response.data.token);
        sessionStorage.setItem('admin_user', JSON.stringify(response.data.admin));
        
        toast.success(response.data.message || 'تم تسجيل الدخول بنجاح');
        
        // إعادة التوجيه إلى لوحة التحكم (المنشورات كصفحة رئيسية حالياً)
        navigate('/publications');
        
        // إعادة تحميل الصفحة لتطبيق الـ Interceptor على كل الطلبات
        setTimeout(() => {
           window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'فشل تسجيل الدخول. يرجى التأكد من صحة البيانات.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          البريد الإلكتروني
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009cad]"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          كلمة المرور
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009cad]"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full rounded-xl text-white py-3 font-semibold transition ${isLoading ? 'bg-gray-400' : 'bg-[#009cad] hover:bg-[#008291]'}`}
      >
        {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
      </button>
    </form>
  );
}

export default LoginForm;
