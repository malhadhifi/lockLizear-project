const TableRow = ({ columns, data }) => {
  return (
    <tr className="hover:bg-gray-50">
      {columns.map((column) => (
        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {column.render ? column.render(data[column.key], data) : data[column.key]}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
