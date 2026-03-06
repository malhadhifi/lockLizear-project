// =============================================
// Application Routes Constants
// كل مسارات التطبيق كثوابت
// =============================================

export const ROUTES = {
  // Auth
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Dashboard
  DASHBOARD: '/',

  // Users
  USERS: '/users',
  USERS_CREATE: '/users/create',
  USER_DETAIL: '/users/:id',
  USER_EDIT: '/users/:id/edit',

  // Documents
  DOCUMENTS: '/documents',
  DOCUMENT_DETAIL: '/documents/:id',

  // Publications
  PUBLICATIONS: '/publications',
  PUBLICATIONS_CREATE: '/publications/create',
  PUBLICATION_EDIT: '/publications/:id/edit',

  // Access Control
  ACCESS_CONTROL: '/access-control',

  // Devices
  DEVICES: '/devices',

  // Emails
  EMAILS: '/emails',

  // Sub-Admins
  SUB_ADMINS: '/sub-admins',
  SUB_ADMINS_CREATE: '/sub-admins/create',

  // Reports
  REPORTS: '/reports',
  REPORTS_VIEW_LOGS: '/reports/view-logs',
  REPORTS_ADMIN_LOGS: '/reports/admin-logs',

  // Settings
  SETTINGS: '/settings',

  // Not Found
  NOT_FOUND: '*',
};

export default ROUTES;
