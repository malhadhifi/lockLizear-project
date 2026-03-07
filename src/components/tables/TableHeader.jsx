const TableHeader = ({ columns, onSort, sortBy, sortOrder }) => {
  const handleSort = (column) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider ${
              column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
            }`}
            onClick={() => handleSort(column)}
          >
            <div className="flex items-center space-x-1 space-x-reverse">
              <span>{column.label}</span>
              {column.sortable && sortBy === column.key && (
                <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
