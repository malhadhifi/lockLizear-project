import { timeAgo } from '@/utils/formatDate';

export default function RecentActivity({ activities = [] }) {
  return (
    <div className="card">
      <h3 className="text-base font-semibold text-slate-700 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
            <span className="text-xl">{a.icon || '📦'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 truncate">{a.description}</p>
              <p className="text-xs text-slate-400">{timeAgo(a.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
