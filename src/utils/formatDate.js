const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');
export default formatDate;
