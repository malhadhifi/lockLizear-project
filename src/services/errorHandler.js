import { toast } from 'react-toastify';

export const handleApiError = (error, fallbackMsg = 'An error occurred') => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error   ||
    error?.message                 ||
    fallbackMsg;

  toast.error(message);
  return message;
};

export const getValidationErrors = (error) => {
  return error?.response?.data?.errors || {};
};

export default handleApiError;
