export default function Pagination({ page, totalPages, total, pageSize, onPageChange, onSizeChange }) {
  const from = (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
      <p>Showing {from}–{to} of {total}</p>
      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50">
          ← Prev
        </button>
        <span className="px-3 py-1.5 bg-blue-600 text-white rounded">{page}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50">
          Next →
        </button>
      </div>
    </div>
  );
}
