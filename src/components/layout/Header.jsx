import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">مرحباً، {user?.name}</h2>
          <p className="text-sm text-gray-600">أهلاً بك في لوحة التحكم</p>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse">
          <button className="relative p-2 text-gray-600 hover:text-gray-900">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <Button onClick={handleLogout} variant="outline" size="sm">
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
