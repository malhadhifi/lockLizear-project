import { NavLink } from 'react-router-dom'
import {
  HiHome,
  HiUsers,
  HiVideoCamera,
  HiCollection,
  HiChartBar,
  HiShieldCheck,
  HiCog,
  HiX,
} from 'react-icons/hi'
import { APP_NAME } from '../../constants'

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'لوحة التحكم', path: '/dashboard', icon: HiHome },
    { name: 'المستخدمون', path: '/users', icon: HiUsers },
    { name: 'الفيديوهات', path: '/videos', icon: HiVideoCamera },
    { name: 'المنشورات', path: '/publications', icon: HiCollection },
    { name: 'التقارير', path: '/reports', icon: HiChartBar },
    { name: 'الصلاحيات', path: '/access', icon: HiShieldCheck },
    { name: 'الإعدادات', path: '/settings', icon: HiCog },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-30 w-64 bg-white dark:bg-dark-800 border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400">
            {APP_NAME}
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <HiX className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            © 2026 DRM System
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
