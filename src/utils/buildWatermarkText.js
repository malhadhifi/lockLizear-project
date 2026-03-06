// =============================================
// Watermark Text Builder
// توليد نص العلامة المائية الديناميكي
// =============================================

/**
 * Build dynamic watermark text by replacing variables
 * Supported variables: [UserName], [Email], [Date], [Time], [Company], [IP]
 * @param {string} template  e.g. "[UserName] - [Email] - [Date]"
 * @param {Object} userData
 * @returns {string}
 */
export const buildWatermarkText = (template, userData = {}) => {
  if (!template) return '';
  const now = new Date();
  const replacements = {
    '[UserName]': userData.name || '',
    '[Email]': userData.email || '',
    '[Date]': now.toLocaleDateString('en-US'),
    '[Time]': now.toLocaleTimeString('en-US'),
    '[Company]': userData.company || '',
    '[IP]': userData.ip || '',
    '[UserId]': userData.id || '',
  };
  let result = template;
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replaceAll(key, value);
  });
  return result;
};

export const WATERMARK_VARIABLES = [
  { key: '[UserName]', description: 'Full name of the user' },
  { key: '[Email]', description: 'Email address of the user' },
  { key: '[Date]', description: 'Current date' },
  { key: '[Time]', description: 'Current time' },
  { key: '[Company]', description: 'Company name' },
  { key: '[IP]', description: 'User IP address' },
  { key: '[UserId]', description: 'User ID' },
];

export default buildWatermarkText;
