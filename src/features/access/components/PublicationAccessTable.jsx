import DataTable from '../../../components/tables/DataTable';

const PublicationAccessTable = () => {
  const columns = [
    { key: 'publication', label: 'المنشور' },
    { key: 'access', label: 'الصلاحية' },
    { key: 'expiry_date', label: 'تاريخ الانتهاء' }
  ];

  return <DataTable columns={columns} data={[]} loading={false} />;
};

export default PublicationAccessTable;
