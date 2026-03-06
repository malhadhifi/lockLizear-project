import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../store/usersSlice';
import PageHeader      from '@/components/layout/PageHeader';
import UserTable       from '../components/UserTable';
import UserFilters     from '../components/UserFilters';
import UserBulkActions from '../components/UserBulkActions';
import ImportUsersModal from '../components/ImportUsersModal';
import Button          from '@/components/common/Button';
import ExportButton    from '@/components/tables/ExportButton';
import ROUTES          from '@/constants/routes';

export default function UsersListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, pagination } = useSelector((s) => s.users);
  const [selected, setSelected]   = useState([]);
  const [filters,  setFilters]    = useState({ search: '', status: '' });
  const [showImport, setShowImport] = useState(false);

  useEffect(() => { dispatch(fetchUsers(filters)); }, [filters]);

  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div>
      <PageHeader
        title="Users" subtitle={`${pagination.total} total users`}
        breadcrumbs={['Dashboard', 'Users']}
        actions={<>
          <ExportButton onClick={() => {}} />
          <Button icon="⬆️" variant="outline" size="sm" onClick={() => setShowImport(true)}>Import</Button>
          <Button icon="➕" onClick={() => navigate(ROUTES.USERS_CREATE)}>Add User</Button>
        </>}
      />
      <UserFilters
        onSearch={(q) => setFilters({ ...filters, search: q })}
        onFilter={(k, v) => setFilters({ ...filters, [k]: v })}
        filterValues={filters}
      />
      <UserBulkActions
        selectedCount={selected.length}
        onClear={() => setSelected([])}
        onActivate={() => {}}
        onSuspend={() => {}}
        onDelete={() => {}}
        onResend={() => {}}
      />
      <div className="card">
        <UserTable
          users={list} loading={loading}
          selectedRows={selected} onSelect={toggleSelect}
          onEdit={(u) => navigate(`/users/${u.id}`)}
          onDelete={(id) => {}}
          pagination={{ ...pagination, onPageChange: (p) => dispatch(fetchUsers({ ...filters, page: p })) }}
        />
      </div>
      <ImportUsersModal isOpen={showImport} onClose={() => setShowImport(false)}
                        onSuccess={() => dispatch(fetchUsers(filters))} />
    </div>
  );
}
