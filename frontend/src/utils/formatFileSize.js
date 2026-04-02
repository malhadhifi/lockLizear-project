const formatFileSize = (bytes = 0) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
export default formatFileSize;
