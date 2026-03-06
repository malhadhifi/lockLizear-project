import Modal  from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useState } from 'react';
import userService from '../services/userService';
import useToast from '@/hooks/useToast';

export default function ResendLicenseModal({ isOpen, onClose, userId, userName }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleResend = async () => {
    setLoading(true);
    try {
      await userService.resendLicense(userId);
      toast.success(`License email sent to ${userName}`);
      onClose();
    } catch { toast.error('Failed to resend license'); }
    finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resend License Email" size="sm">
      <p className="text-slate-600 text-sm mb-6">
        Resend license activation email to <strong>{userName}</strong>?
      </p>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button loading={loading} onClick={handleResend}>Send Email</Button>
      </div>
    </Modal>
  );
}
