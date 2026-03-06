import { useState } from 'react';
import Input  from '@/components/common/Input';
import Button from '@/components/common/Button';
import authService from '../services/authService';
import useToast from '@/hooks/useToast';

export default function ForgotPasswordForm() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('Reset link sent to your email');
    } catch { toast.error('Failed to send reset link'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password</h2>
      <p className="text-slate-500 text-sm mb-6">أدخل بريدك الإلكتروني لإعادة الضبط</p>
      <Input label="Email" name="email" type="email" value={email}
             onChange={(e) => setEmail(e.target.value)} required />
      <Button type="submit" loading={loading} className="w-full mt-2 justify-center">
        Send Reset Link
      </Button>
    </form>
  );
}
