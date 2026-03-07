const errorHandler = (error) => error?.response?.data?.message || error.message || 'Unknown error';
export default errorHandler;
