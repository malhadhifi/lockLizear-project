import useAuth from '@/hooks/useAuth';
import Avatar from '@/components/common/Avatar';

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center
                       justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <input
          placeholder="Search..."
          className="hidden md:block w-72 px-4 py-2 text-sm bg-slate-100
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <span className="text-lg">🔔</span>
        </button>
        <div className="flex items-center gap-2">
          <Avatar name={user?.name} size="sm" />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
