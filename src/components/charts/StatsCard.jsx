export default function StatsCard({ title, value, icon, color = 'blue', change, subtitle }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-600',
    green:  'bg-green-50 text-green-600',
    red:    'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {change !== undefined && (
            <span className={`text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {change >= 0 ? '+' : ''}{change}% this month
            </span>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
