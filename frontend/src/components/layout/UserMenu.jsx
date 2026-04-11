import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { HiUser, HiCog, HiLogout, HiChevronDown } from 'react-icons/hi'
import { logout } from '../../features/auth/store/authSlice'
import toast from 'react-hot-toast'

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    toast.success('تم تسجيل الخروج بنجاح')
    navigate('/login')
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user?.name || 'المستخدم'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role || 'مدير'}
            </p>
          </div>
        </div>
        <HiChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-slide-in">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {user?.email}
            </p>
          </div>

          <button
            onClick={() => {
              setIsOpen(false)
              navigate('/settings')
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <HiUser className="w-4 h-4" />
            <span>الملف الشخصي</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false)
              navigate('/settings')
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <HiCog className="w-4 h-4" />
            <span>الإعدادات</span>
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
            >
              <HiLogout className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
