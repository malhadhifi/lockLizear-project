import { useEffect, useState } from 'react';
import userService from '../services/userService';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import EmptyState from '@/components/common/EmptyState';
import { formatDateTime } from '@/utils/formatDate';
import Button from '@/components/common/Button';

export default function UserDevicesList({ userId }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setDevices(await userService.getUserDevices(userId)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [userId]);

  if (loading) return <SkeletonLoader rows={3} />;
  if (!devices.length) return <EmptyState icon="💻" title="No devices registered" />;

  return (
    <div className="space-y-3">
      {devices.map((d) => (
        <div key={d.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
          <div>
            <p className="font-medium text-slate-800">{d.device_name || d.device_type}</p>
            <p className="text-xs text-slate-500">Last seen: {formatDateTime(d.last_seen)}</p>
            <p className="text-xs text-slate-400">{d.ip_address}</p>
          </div>
          <Button variant="danger" size="xs" onClick={() => userService.revokeDevice(d.id).then(load)}>
            Revoke
          </Button>
        </div>
      ))}
    </div>
  );
}
