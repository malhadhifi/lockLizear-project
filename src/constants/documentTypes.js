// =============================================
// Document Types Constants
// أنواع الملفات المدعومة في النظام
// =============================================

export const DOCUMENT_TYPES = {
  VIDEO: 'video',
  PDF: 'pdf',
  WORD: 'word',
};

export const DOCUMENT_TYPE_LABELS = {
  [DOCUMENT_TYPES.VIDEO]: 'Video',
  [DOCUMENT_TYPES.PDF]: 'PDF',
  [DOCUMENT_TYPES.WORD]: 'Word',
};

export const DOCUMENT_TYPE_ICONS = {
  [DOCUMENT_TYPES.VIDEO]: '🎬',
  [DOCUMENT_TYPES.PDF]: '📄',
  [DOCUMENT_TYPES.WORD]: '📝',
};

export const DOCUMENT_TYPE_COLORS = {
  [DOCUMENT_TYPES.VIDEO]: 'blue',
  [DOCUMENT_TYPES.PDF]: 'red',
  [DOCUMENT_TYPES.WORD]: 'indigo',
};

export const EXPIRY_TYPES = {
  DATE: 'date',         // تاريخ انتهاء محدد
  DAYS: 'days',         // عدد أيام من أول مشاهدة
  VIEWS: 'views',       // عدد مشاهدات
  NEVER: 'never',       // لا ينتهي
};

export const EXPIRY_TYPE_LABELS = {
  [EXPIRY_TYPES.DATE]: 'Fixed Date',
  [EXPIRY_TYPES.DAYS]: 'Days After First Open',
  [EXPIRY_TYPES.VIEWS]: 'Number of Views',
  [EXPIRY_TYPES.NEVER]: 'Never Expires',
};

export default DOCUMENT_TYPES;
