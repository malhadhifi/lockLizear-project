import DataTable    from '@/components/tables/DataTable';
import TableActions from '@/components/tables/TableActions';
import UserStatusBadge from './UserStatusBadge';
import { formatDate } from '@/utils/formatDate';

export default function UserTable({ users, loading, pagination, onEdit, onDelete, onSelect, selectedRows }) {
  const columns = [
    { key: 'name',        label: 'Name',         render: (v, r) => (
        <div><p className="font-medium text-slate-800">{v}</p><p className="text-xs text-slate-500">{r.email}</p></div>
    )},
    { key: 'status',      label: 'Status',       render: (v) => <UserStatusBadge status={v} /> },
    { key: 'max_devices', label: 'Devices',      render: (v) => v ?? '—' },
    { key: 'expiry_date', label: 'Expiry',       render: (v) => formatDate(v) || 'Never' },
    { key: 'created_at',  label: 'Created',      render: (v) => formatDate(v) },
    { key: 'actions',     label: 'Actions',      render: (_, row) => (
        <TableActions actions={[
          { label: 'Edit',   icon: '✏️', onClick: () => onEdit(row) },
          { label: 'Delete', icon: '🗑️', onClick: () => onDelete(row.id), variant: 'danger' },
        ]} />
    )},
  ];
  return (
    <DataTable columns={columns} data={users} loading={loading}
               pagination={pagination} selectedRows={selectedRows}
               onSelectRow={(id) => onSelect(id)} />
  );
}
