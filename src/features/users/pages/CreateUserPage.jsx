import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import UserForm   from '../components/UserForm';
import userService from '../services/userService';
import useToast   from '@/hooks/useToast';
import ROUTES     from '@/constants/routes';

export default function CreateUserPage() {
  const navigate = useNavigate();
  const toast    = useToast();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      await userService.create(data);
      toast.success('User created successfully');
      navigate(ROUTES.USERS);
    } catch { toast.error('Failed to create user'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Create User" breadcrumbs={['Dashboard', 'Users', 'Create']} />
      <div className="card max-w-2xl">
        <UserForm onSubmit={handleCreate} loading={loading} />
      </div>
    </div>
  );
}
