import TableFilters from '@/components/tables/TableFilters';
import { USER_STATUS } from '@/constants/status';

const statusOptions = Object.values(USER_STATUS).map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }));

export default function UserFilters({ onSearch, onFilter, filterValues }) {
  return (
    <TableFilters
      onSearch={onSearch}
      onFilterChange={onFilter}
      values={filterValues}
      filters={[
        { name: 'status', placeholder: 'All Statuses', options: statusOptions },
      ]}
    />
  );
}
