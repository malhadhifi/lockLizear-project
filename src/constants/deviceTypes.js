// =============================================
// Device Types Constants
// أنواع الأجهزة المدعومة
// =============================================

export const DEVICE_TYPES = {
  WINDOWS: 'windows',
  MAC: 'mac',
  LINUX: 'linux',
  IOS: 'ios',
  ANDROID: 'android',
  UNKNOWN: 'unknown',
};

export const DEVICE_TYPE_LABELS = {
  [DEVICE_TYPES.WINDOWS]: 'Windows',
  [DEVICE_TYPES.MAC]: 'macOS',
  [DEVICE_TYPES.LINUX]: 'Linux',
  [DEVICE_TYPES.IOS]: 'iOS',
  [DEVICE_TYPES.ANDROID]: 'Android',
  [DEVICE_TYPES.UNKNOWN]: 'Unknown',
};

export const DEVICE_TYPE_ICONS = {
  [DEVICE_TYPES.WINDOWS]: '🖥️',
  [DEVICE_TYPES.MAC]: '🍎',
  [DEVICE_TYPES.LINUX]: '🐧',
  [DEVICE_TYPES.IOS]: '📱',
  [DEVICE_TYPES.ANDROID]: '📱',
  [DEVICE_TYPES.UNKNOWN]: '💻',
};

export const DEVICE_STATUS = {
  ACTIVE: 'active',
  REVOKED: 'revoked',
};

export default DEVICE_TYPES;
