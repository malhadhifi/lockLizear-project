// =============================================
// CSV Export Utility
// أداة تصدير البيانات لـ CSV
// =============================================

import Papa from 'papaparse';

/**
 * Export data array as CSV file
 * @param {Array} data
 * @param {string} filename
 * @param {Object} options
 */
export const exportToCSV = (data, filename = 'export', options = {}) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }
  const csv = Papa.unparse(data, { header: true, ...options });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export users list to CSV
 * @param {Array} users
 */
export const exportUsersCSV = (users) => {
  const mapped = users.map(u => ({
    name: u.name,
    email: u.email,
    status: u.status,
    max_devices: u.max_devices,
    expiry_date: u.expiry_date || '',
    created_at: u.created_at,
  }));
  exportToCSV(mapped, 'users_export');
};

export default exportToCSV;
