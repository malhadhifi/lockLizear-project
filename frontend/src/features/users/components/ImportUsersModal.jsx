import { useState } from 'react';
import Modal  from '@/components/common/Modal';
import Button from '@/components/common/Button';
import useToast from '@/hooks/useToast';
import userService from '../services/userService';

export default function ImportUsersModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleImport = async () => {
    if (!file) return toast.error('Please select a CSV file');
    setLoading(true);
    try {
      const result = await userService.importCSV(file);
      toast.success(`${result.imported} users imported successfully`);
      onSuccess(); onClose();
    } catch { toast.error('Import failed'); }
    finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Users from CSV"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={handleImport}>Import</Button>
        </div>
      }>
      <p className="text-sm text-slate-600 mb-4">
        Upload a CSV file with columns: <code className="bg-slate-100 px-1 rounded">name, email, password, status</code>
      </p>
      <input type="file" accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        className="form-input" />
    </Modal>
  );
}
