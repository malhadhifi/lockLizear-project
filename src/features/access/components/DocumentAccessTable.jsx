import DataTable from '../../../components/tables/DataTable';

const DocumentAccessTable = () => {
  const columns = [
    { key: 'document', label: 'الملف' },
    { key: 'access', label: 'الصلاحية' },
    { key: 'expiry_date', label: 'تاريخ الانتهاء' }
  ];

  return <DataTable columns={columns} data={[]} loading={false} />;
};

export default DocumentAccessTable;
