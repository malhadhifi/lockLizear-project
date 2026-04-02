// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'DRM Admin Panel'

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  USER: 'user',
}

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
}

// File Types
export const FILE_TYPES = {
  VIDEO: 'video',
  PDF: 'pdf',
  DOCUMENT: 'document',
}

// Max Devices per User
export const MAX_DEVICES_OPTIONS = [1, 2, 3, 5, 10, -1] // -1 = unlimited

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
}

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

// Toast Messages (Arabic/English)
export const MESSAGES = {
  ar: {
    success: {
      login: 'تم تسجيل الدخول بنجاح',
      logout: 'تم تسجيل الخروج بنجاح',
      created: 'تم الإنشاء بنجاح',
      updated: 'تم التحديث بنجاح',
      deleted: 'تم الحذف بنجاح',
    },
    error: {
      general: 'حدث خطأ ما، يرجى المحاولة مرة أخرى',
      network: 'خطأ في الاتصال، تحقق من الإنترنت',
      unauthorized: 'غير مصرح بالدخول',
      forbidden: 'لا تملك صلاحية للوصول',
    },
  },
  en: {
    success: {
      login: 'Logged in successfully',
      logout: 'Logged out successfully',
      created: 'Created successfully',
      updated: 'Updated successfully',
      deleted: 'Deleted successfully',
    },
    error: {
      general: 'Something went wrong, please try again',
      network: 'Network error, check your internet connection',
      unauthorized: 'Unauthorized access',
      forbidden: 'You don\'t have permission to access this',
    },
  },
}

// Chart Colors
export const CHART_COLORS = {
  primary: '#0ea5e9',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#0284c7',
  purple: '#a855f7',
  pink: '#ec4899',
  indigo: '#6366f1',
}
