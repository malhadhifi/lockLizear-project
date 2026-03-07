import { Link } from 'react-router-dom';

const NavItem = ({ to, icon, label, active }) => {
  const baseClasses = "flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-colors";
  const activeClasses = active
    ? "bg-blue-600 text-white"
    : "text-gray-300 hover:bg-gray-800 hover:text-white";

  return (
    <Link to={to} className={`${baseClasses} ${activeClasses}`}>
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default NavItem;
