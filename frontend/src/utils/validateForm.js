const validateForm = (values = {}) => Object.values(values).every((value) => value !== undefined);
export default validateForm;
