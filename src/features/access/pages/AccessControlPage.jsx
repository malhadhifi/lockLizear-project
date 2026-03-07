import PageHeader from '../../../components/layout/PageHeader';
import UserSelector from '../components/UserSelector';
import AccessTabs from '../components/AccessTabs';

const AccessControlPage = () => {
  return (
    <div>
      <PageHeader title="إدارة الصلاحيات" />
      <UserSelector />
      <AccessTabs />
    </div>
  );
};

export default AccessControlPage;
