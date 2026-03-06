import { toast } from 'react-toastify';
import { useCallback } from 'react';

export const useToast = () => {
  const success = useCallback((msg) => toast.success(msg), []);
  const error   = useCallback((msg) => toast.error(msg),   []);
  const info    = useCallback((msg) => toast.info(msg),    []);
  const warning = useCallback((msg) => toast.warning(msg), []);

  return { success, error, info, warning };
};

export default useToast;
