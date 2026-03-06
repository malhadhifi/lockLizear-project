import { NavLink } from 'react-router-dom';

export default function NavItem({ label, icon, to }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
         ${isActive
           ? 'bg-blue-600 text-white font-medium'
           : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
      }
    >
      <span className="text-base w-5 text-center">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
