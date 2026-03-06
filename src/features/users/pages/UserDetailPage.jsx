import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from '../store/usersSlice';
import PageHeader      from '@/components/layout/PageHeader';
import Tabs            from '@/components/common/Tabs';
import UserDevicesList from '../components/UserDevicesList';
import UserForm        from '../components/UserForm';
import LoadingSpinner  from '@/components/common/LoadingSpinner';
import userService     from '../services/userService';
import useToast        from '@/hooks/useToast';

const TABS = [
  { key: 'details',  label: 'Details',  icon: '👤' },
  { key: 'devices',  label: 'Devices',  icon: '💻' },
];

export default function UserDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast    = useToast();
  const { selectedUser: user, loading } = useSelector((s) => s.users);
  const [tab,     setTab]    = useState('details');
  const [saving,  setSaving] = useState(false);

  useEffect(() => { dispatch(fetchUserById(id)); }, [id]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      await userService.update(id, data);
      toast.success('User updated successfully');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner className="mt-20" />;

  return (
    <div>
      <PageHeader title={user?.name || 'User Detail'}
                  breadcrumbs={['Dashboard', 'Users', user?.name || id]} />
      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />
      <div className="card">
        {tab === 'details' && <UserForm initialData={user} onSubmit={handleSave} loading={saving} />}
        {tab === 'devices' && <UserDevicesList userId={id} />}
      </div>
    </div>
  );
}
