import Tabs from '../../../components/common/Tabs';
import PropertiesForm from './PropertiesForm';
import DocumentAccessTable from './DocumentAccessTable';
import PublicationAccessTable from './PublicationAccessTable';

const AccessTabs = () => {
  const tabs = [
    { id: 'properties', label: 'الخصائص', content: <PropertiesForm /> },
    { id: 'documents', label: 'الملفات', content: <DocumentAccessTable /> },
    { id: 'publications', label: 'المنشورات', content: <PublicationAccessTable /> }
  ];

  return <Tabs tabs={tabs} />;
};

export default AccessTabs;
