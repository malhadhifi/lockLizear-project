// =============================================
// File Size Formatting Utility
// تنسيق حجم الملفات
// =============================================

/**
 * Convert bytes to human readable size
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default formatFileSize;
