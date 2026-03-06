import { useState, useCallback } from 'react';

export const useConfirmDialog = () => {
  const [isOpen,  setIsOpen]  = useState(false);
  const [config,  setConfig]  = useState({});
  const [resolve, setResolve] = useState(null);

  const confirm = useCallback((cfg = {}) => {
    setConfig(cfg);
    setIsOpen(true);
    return new Promise((res) => setResolve(() => res));
  }, []);

  const onConfirm = () => { setIsOpen(false); resolve && resolve(true); };
  const onCancel  = () => { setIsOpen(false); resolve && resolve(false); };

  return { isOpen, config, confirm, onConfirm, onCancel };
};

export default useConfirmDialog;
