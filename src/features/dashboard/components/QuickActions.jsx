import { useNavigate } from 'react-router-dom';
import ROUTES from '@/constants/routes';

const actions = [
  { label: 'Add User',         icon: '➕', to: ROUTES.USERS_CREATE,       color: 'bg-blue-100 text-blue-700'   },
  { label: 'Manage Access',    icon: '🔒', to: ROUTES.ACCESS_CONTROL,     color: 'bg-green-100 text-green-700'  },
  { label: 'View Reports',     icon: '📊', to: ROUTES.REPORTS,            color: 'bg-purple-100 text-purple-700'},
  { label: 'Add Publication',  icon: '📚', to: ROUTES.PUBLICATIONS_CREATE,color: 'bg-orange-100 text-orange-700'},
];

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="card">
      <h3 className="text-base font-semibold text-slate-700 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a) => (
          <button key={a.to} onClick={() => navigate(a.to)}
            className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium
                        transition-all hover:opacity-80 ${a.color}`}>
            <span className="text-xl">{a.icon}</span> {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
