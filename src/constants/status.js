// =============================================
// Status Constants
// قيم الحالات المستخدمة في النظام
// =============================================

export const USER_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
  PENDING: 'pending',
};

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: 'Active',
  [USER_STATUS.SUSPENDED]: 'Suspended',
  [USER_STATUS.EXPIRED]: 'Expired',
  [USER_STATUS.PENDING]: 'Pending',
};

export const USER_STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: 'green',
  [USER_STATUS.SUSPENDED]: 'yellow',
  [USER_STATUS.EXPIRED]: 'red',
  [USER_STATUS.PENDING]: 'gray',
};

export const DOCUMENT_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DRAFT: 'draft',
};

export const DOCUMENT_STATUS_LABELS = {
  [DOCUMENT_STATUS.ACTIVE]: 'Active',
  [DOCUMENT_STATUS.SUSPENDED]: 'Suspended',
  [DOCUMENT_STATUS.DRAFT]: 'Draft',
};

export const EMAIL_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  OPENED: 'opened',
  BOUNCED: 'bounced',
  PENDING: 'pending',
  FAILED: 'failed',
};

export const EMAIL_STATUS_LABELS = {
  [EMAIL_STATUS.SENT]: 'Sent',
  [EMAIL_STATUS.DELIVERED]: 'Delivered',
  [EMAIL_STATUS.OPENED]: 'Opened',
  [EMAIL_STATUS.BOUNCED]: 'Bounced',
  [EMAIL_STATUS.PENDING]: 'Pending',
  [EMAIL_STATUS.FAILED]: 'Failed',
};

export default USER_STATUS;
