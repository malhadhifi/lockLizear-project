const parseCSV = (text = '') => text.split('\n').map((line) => line.split(','));
export default parseCSV;
