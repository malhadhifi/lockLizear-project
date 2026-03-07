import TableHeader from './TableHeader';
import TableRow from './TableRow';
import Pagination from './Pagination';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';

const DataTable = ({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onSort,
  sortBy,
  sortOrder
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState message="لا توجد بيانات" />;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader
            columns={columns}
            onSort={onSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <TableRow key={row.id || index} columns={columns} data={row} />
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default DataTable;
