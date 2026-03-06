import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginThunk } from '../store/authSlice';
import Input  from '@/components/common/Input';
import Button from '@/components/common/Button';
import ROUTES from '@/constants/routes';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginThunk(form));
    if (loginThunk.fulfilled.match(result)) navigate(ROUTES.DASHBOARD);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Sign In</h2>
      <p className="text-slate-500 text-sm mb-6">ادخل بيانات حسابك</p>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      <Input label="Email" name="email" type="email" value={form.email}
             onChange={handleChange} required placeholder="admin@example.com" />
      <Input label="Password" name="password" type="password" value={form.password}
             onChange={handleChange} required placeholder="••••••••" />
      <Button type="submit" loading={loading} className="w-full mt-2 justify-center">
        Sign In
      </Button>
    </form>
  );
}
