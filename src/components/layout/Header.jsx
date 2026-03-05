import { HiMenu, HiBell } from 'react-icons/hi'
import UserMenu from './UserMenu'

const Header = ({ onMenuClick, isSidebarOpen }) => {
  return (
    <header className="h-16 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
        >
          <HiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            لوحة التحكم
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <HiBell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 left-1 w-2 h-2 bg-danger-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  )
}

export default Header
