import Badge from '@/components/common/Badge';
import { USER_STATUS_COLORS, USER_STATUS_LABELS } from '@/constants/status';

export default function UserStatusBadge({ status }) {
  return (
    <Badge
      label={USER_STATUS_LABELS[status] || status}
      variant={USER_STATUS_COLORS[status]?.replace('badge-', '') || 'default'}
    />
  );
}
