import TableHeader  from './TableHeader';
import TableRow    from './TableRow';
import Pagination  from './Pagination';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import EmptyState  from '@/components/common/EmptyState';

export default function DataTable({
  columns = [], data = [], loading = false,
  pagination, onRowClick, selectedRows = [],
  onSelectRow, onSelectAll,
}) {
  if (loading) return <SkeletonLoader rows={8} />;
  if (!data.length) return <EmptyState title="No records found" />;

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table>
          <TableHeader
            columns={columns}
            selectedAll={selectedRows.length === data.length}
            onSelectAll={onSelectAll}
          />
          <tbody>
            {data.map((row, i) => (
              <TableRow
                key={row.id || i}
                row={row} columns={columns}
                selected={selectedRows.includes(row.id)}
                onSelect={onSelectRow}
                onClick={onRowClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      {pagination && <Pagination {...pagination} />}
    </div>
  );
}
