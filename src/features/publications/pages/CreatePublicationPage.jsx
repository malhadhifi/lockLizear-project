import PageHeader from '../../../components/layout/PageHeader';
import PublicationForm from '../components/PublicationForm';

const CreatePublicationPage = () => {
  return (
    <div>
      <PageHeader title="إضافة منشور جديد" />
      <div className="bg-white rounded-lg shadow p-6">
        <PublicationForm />
      </div>
    </div>
  );
};

export default CreatePublicationPage;
