// =============================================
// useToast Hook
// إشعارات النجاح والخطأ والتحذير
// =============================================

import toast from 'react-hot-toast';

export const useToast = () => {
  const success = (message) =>
    toast.success(message, { duration: 3000, position: 'top-right' });

  const error = (message) =>
    toast.error(message, { duration: 4000, position: 'top-right' });

  const warning = (message) =>
    toast(message, { icon: '⚠️', duration: 4000, position: 'top-right' });

  const info = (message) =>
    toast(message, { icon: 'ℹ️', duration: 3000, position: 'top-right' });

  const loading = (message) =>
    toast.loading(message, { position: 'top-right' });

  const dismiss = (toastId) => toast.dismiss(toastId);

  return { success, error, warning, info, loading, dismiss };
};

export default useToast;
