const buildWatermarkText = (template = '', data = {}) => template.replace(/\[(\w+)\]/g, (_, key) => data[key] ?? `[${key}]`);
export default buildWatermarkText;
