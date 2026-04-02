import { useState } from 'react';
import Input        from '@/components/common/Input';
import Select       from '@/components/common/Select';
import DatePicker   from '@/components/common/DatePicker';
import NumberInput  from '@/components/common/NumberInput';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import Button       from '@/components/common/Button';
import { USER_STATUS } from '@/constants/status';

const statusOptions = Object.values(USER_STATUS).map((s) => ({ value: s, label: s }));

export default function UserForm({ initialData = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '', email: '', password: '', status: 'active',
    max_devices: 3, expiry_date: '', allow_offline: false, ...initialData,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name"  name="name"  value={form.name}  onChange={handleChange} required />
        <Input label="Email"      name="email" type="email" value={form.email} onChange={handleChange} required />
        <Input label="Password"   name="password" type="password" value={form.password} onChange={handleChange}
               hint={initialData.id ? 'Leave empty to keep current' : ''} />
        <Select label="Status" name="status" value={form.status} onChange={handleChange} options={statusOptions} />
        <NumberInput label="Max Devices" name="max_devices" value={form.max_devices} onChange={handleChange} min={1} />
        <DatePicker  label="Expiry Date" name="expiry_date" value={form.expiry_date} onChange={handleChange} />
      </div>
      <ToggleSwitch label="Allow Offline Access" name="allow_offline"
                   checked={form.allow_offline} onChange={handleChange} />
      <div className="mt-6 flex gap-3 justify-end">
        <Button type="submit" loading={loading}>Save User</Button>
      </div>
    </form>
  );
}
