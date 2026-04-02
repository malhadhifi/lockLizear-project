import BulkActions from '@/components/tables/BulkActions';

export default function UserBulkActions({ selectedCount, onActivate, onSuspend, onDelete, onResend, onClear }) {
  return (
    <BulkActions
      selectedCount={selectedCount}
      onClear={onClear}
      actions={[
        { label: 'Activate',     icon: '✅',    onClick: onActivate, variant: 'success'   },
        { label: 'Suspend',      icon: '⏸️',    onClick: onSuspend,  variant: 'secondary' },
        { label: 'Resend Email', icon: '✉️',    onClick: onResend,   variant: 'secondary' },
        { label: 'Delete',       icon: '🗑️',    onClick: onDelete,   variant: 'danger'    },
      ]}
    />
  );
}
