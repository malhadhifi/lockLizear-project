import { useParams } from 'react-router-dom';
import PageHeader from '../../../components/layout/PageHeader';

const DocumentDetailPage = () => {
  const { id } = useParams();

  return (
    <div>
      <PageHeader title="تفاصيل الملف" />
      <div className="bg-white rounded-lg shadow p-6">
        <p>تفاصيل الملف #{id}</p>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
