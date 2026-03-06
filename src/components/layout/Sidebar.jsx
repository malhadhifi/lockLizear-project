import { NavLink } from 'react-router-dom';
import NavItem from './NavItem';
import ROUTES from '@/constants/routes';
import useAuth from '@/hooks/useAuth';

const navItems = [
  { label: 'Dashboard',       icon: '🏠', to: ROUTES.DASHBOARD       },
  { label: 'Users',           icon: '👥', to: ROUTES.USERS           },
  { label: 'Documents',       icon: '📹', to: ROUTES.DOCUMENTS       },
  { label: 'Publications',    icon: '📚', to: ROUTES.PUBLICATIONS    },
  { label: 'Access Control',  icon: '🔒', to: ROUTES.ACCESS_CONTROL  },
  { label: 'Devices',         icon: '💻', to: ROUTES.DEVICES         },
  { label: 'Emails',          icon: '✉️',  to: ROUTES.EMAILS          },
  { label: 'Sub Admins',      icon: '👤', to: ROUTES.SUB_ADMINS      },
  { label: 'Reports',         icon: '📊', to: ROUTES.REPORTS         },
  { label: 'Settings',        icon: '⚙️',  to: ROUTES.SETTINGS        },
];

export default function Sidebar() {
  const { user, handleLogout } = useAuth();
  return (
    <aside className="w-64 bg-slate-900 flex flex-col h-full text-slate-300 shrink-0">
      <div className="p-5 border-b border-slate-700">
        <h1 className="text-white font-bold text-xl">DRM Admin</h1>
        <p className="text-slate-400 text-xs mt-1">نظام حماية المحتوى</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <p className="text-sm text-slate-300 truncate">{user?.name}</p>
        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        <button onClick={handleLogout}
          className="mt-3 w-full text-left text-xs text-red-400 hover:text-red-300">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
