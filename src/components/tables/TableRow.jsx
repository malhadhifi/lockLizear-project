export default function TableRow({ row, columns, selected, onSelect, onClick }) {
  return (
    <tr
      onClick={() => onClick && onClick(row)}
      className={`${onClick ? 'cursor-pointer' : ''} ${selected ? 'bg-blue-50' : ''}`}
    >
      {onSelect && (
        <td onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={selected}
            onChange={() => onSelect(row.id)}
            className="rounded border-slate-300 text-blue-600" />
        </td>
      )}
      {columns.map((col) => (
        <td key={col.key} className={col.cellClass}>
          {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
        </td>
      ))}
    </tr>
  );
}
