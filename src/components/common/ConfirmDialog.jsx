import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  isOpen, onConfirm, onCancel,
  title = 'Confirm Action',
  message = 'Are you sure?',
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  variant = 'danger',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <p className="text-slate-600 text-sm">{message}</p>
      <div className="flex gap-3 mt-6 justify-end">
        <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
        <Button variant={variant}   onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
