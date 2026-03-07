import { Link, useLocation } from 'react-router-dom';
import NavItem from './NavItem';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: ROUTES.DASHBOARD, icon: '📊', label: 'لوحة التحكم' },
    { path: ROUTES.USERS, icon: '👥', label: 'المستخدمون' },
    { path: ROUTES.DOCUMENTS, icon: '📁', label: 'الملفات' },
    { path: ROUTES.PUBLICATIONS, icon: '📚', label: 'المنشورات' },
    { path: ROUTES.ACCESS_CONTROL, icon: '🔐', label: 'التحكم بالوصول' },
    { path: ROUTES.DEVICES, icon: '💻', label: 'الأجهزة' },
    { path: ROUTES.EMAILS, icon: '✉️', label: 'البريد الإلكتروني' },
    { path: ROUTES.SUB_ADMINS, icon: '👨‍💼', label: 'المشرفون' },
    { path: ROUTES.REPORTS, icon: '📈', label: 'التقارير' },
    { path: ROUTES.SETTINGS, icon: '⚙️', label: 'الإعدادات' }
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2 space-x-reverse">
          <img src="/logo.svg" alt="Logo" className="h-8" />
          <span className="text-xl font-bold">DRM Panel</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path || location.pathname.startsWith(item.path + '/')}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400">{user?.role || 'مدير'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
