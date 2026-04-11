export default function EmptyState({ icon = '📦', title = 'No data found', subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
      {subtitle && <p className="text-slate-500 text-sm mb-6">{subtitle}</p>}
      {action}
    </div>
  );
}
