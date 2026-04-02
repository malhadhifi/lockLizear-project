// =============================================
// useConfirmDialog Hook
// تأكيد الحذف أو الإلغاء قبل التنفيذ
// =============================================

import { useState } from 'react';

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    variant: 'danger',
    onConfirm: null,
  });

  const openDialog = (options) => {
    setConfig({ ...config, ...options });
    setIsOpen(true);
  };

  const closeDialog = () => setIsOpen(false);

  const confirm = (options) => {
    return new Promise((resolve) => {
      openDialog({
        ...options,
        onConfirm: () => { closeDialog(); resolve(true); },
      });
    });
  };

  return { isOpen, config, openDialog, closeDialog, confirm };
};

export default useConfirmDialog;
