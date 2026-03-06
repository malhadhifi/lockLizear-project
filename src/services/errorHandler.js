// =============================================
// Centralized Error Handler
// معالجة الأخطاء المركزية
// =============================================

/**
 * Extract readable error message from API error
 * @param {Error} error
 * @returns {string}
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';
  // Laravel validation errors (422)
  if (error.response?.status === 422) {
    const errors = error.response.data?.errors;
    if (errors) {
      return Object.values(errors).flat().join('. ');
    }
  }
  // Custom API message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  // Network error
  if (error.message === 'Network Error') {
    return 'Network error. Please check your internet connection.';
  }
  // Timeout
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }
  return error.message || 'An unexpected error occurred';
};

export const handleApiError = (error, showToast) => {
  const message = getErrorMessage(error);
  if (showToast) showToast(message);
  console.error('[API Error]', error);
  return message;
};

export default getErrorMessage;
