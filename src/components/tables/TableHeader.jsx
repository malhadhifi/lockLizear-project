export default function TableHeader({ columns = [], selectedAll = false, onSelectAll }) {
  return (
    <thead>
      <tr>
        {onSelectAll && (
          <th className="w-10">
            <input type="checkbox" checked={selectedAll} onChange={onSelectAll}
              className="rounded border-slate-300 text-blue-600" />
          </th>
        )}
        {columns.map((col) => (
          <th key={col.key} style={{ width: col.width }} className={col.headerClass}>
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
