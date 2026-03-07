import PageHeader from '../../../components/layout/PageHeader';
import DataTable from '../../../components/tables/DataTable';
import DocumentFilters from '../components/DocumentFilters';
import Badge from '../../../components/common/Badge';
import { DOCUMENT_TYPE_LABELS } from '../../../constants/documentTypes';

const DocumentsListPage = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'العنوان' },
    {
      key: 'type',
      label: 'النوع',
      render: (value) => DOCUMENT_TYPE_LABELS[value] || value
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value) => <Badge status={value} />
    },
    { key: 'views_count', label: 'المشاهدات' }
  ];

  return (
    <div>
      <PageHeader title="إدارة الملفات" />
      <DocumentFilters />
      <DataTable columns={columns} data={[]} loading={false} />
    </div>
  );
};

export default DocumentsListPage;
