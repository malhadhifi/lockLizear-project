const exportCSV = (rows = []) => rows.map((row) => row.join(',')).join('\n');
export default exportCSV;
