// =============================================
// Date Formatting Utilities
// أدوات تنسيق التواريخ
// =============================================

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format a date string to readable format
 * @param {string|Date} date
 * @param {string} pattern
 * @returns {string}
 */
export const formatDate = (date, pattern = 'yyyy-MM-dd') => {
  if (!date) return '-';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsed)) return '-';
    return format(parsed, pattern);
  } catch {
    return '-';
  }
};

export const formatDateTime = (date) =>
  formatDate(date, 'yyyy-MM-dd HH:mm:ss');

export const formatDateAr = (date) =>
  formatDate(date, 'dd/MM/yyyy');

export const timeAgo = (date) => {
  if (!date) return '-';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch {
    return '-';
  }
};

export const isExpired = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

export const daysUntilExpiry = (date) => {
  if (!date) return null;
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export default formatDate;
