// =============================================
// CSV Parser Utility
// أداة استيراد ملفات CSV
// =============================================

import Papa from 'papaparse';

/**
 * Parse CSV file and return array of objects
 * @param {File} file
 * @param {Object} options
 * @returns {Promise<{data: Array, errors: Array}>}
 */
export const parseCSV = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_'),
      ...options,
      complete: (results) => resolve({ data: results.data, errors: results.errors }),
      error: (error) => reject(error),
    });
  });
};

/**
 * Validate parsed user CSV rows
 * @param {Array} rows
 * @returns {{valid: Array, invalid: Array}}
 */
export const validateUserCSV = (rows) => {
  const valid = [];
  const invalid = [];
  rows.forEach((row, index) => {
    const errors = [];
    if (!row.name || row.name.trim() === '') errors.push('Name is required');
    if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) errors.push('Valid email is required');
    if (errors.length > 0) {
      invalid.push({ row: index + 2, data: row, errors });
    } else {
      valid.push(row);
    }
  });
  return { valid, invalid };
};

export default parseCSV;
