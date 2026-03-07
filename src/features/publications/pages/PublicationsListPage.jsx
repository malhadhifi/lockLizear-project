import PageHeader from '../../../components/layout/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import { useNavigate } from 'react-router-dom';

const PublicationsListPage = () => {
  const navigate = useNavigate();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'العنوان' },
    { key: 'documents_count', label: 'عدد الملفات' },
    { key: 'subscribers_count', label: 'المشتركون' }
  ];

  return (
    <div>
      <PageHeader
        title="إدارة المنشورات"
        action={{
          label: 'إضافة منشور',
          onClick: () => navigate('/publications/create')
        }}
      />
      <DataTable columns={columns} data={[]} loading={false} />
    </div>
  );
};

export default PublicationsListPage;
