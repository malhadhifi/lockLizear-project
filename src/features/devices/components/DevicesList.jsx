import DataTable from '../../../components/tables/DataTable';

const DevicesList = ({ userId }) => {
  const columns = [
    { key: 'device_name', label: 'اسم الجهاز' },
    { key: 'device_type', label: 'النوع' },
    { key: 'last_active', label: 'آخر نشاط' },
    { key: 'ip_address', label: 'عنوان IP' }
  ];

  return <DataTable columns={columns} data={[]} loading={false} />;
};

export default DevicesList;
