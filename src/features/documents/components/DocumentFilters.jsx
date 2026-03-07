import SearchBox from '../../../components/common/SearchBox';
import Select from '../../../components/common/Select';
import { DOCUMENT_TYPES } from '../../../constants/documentTypes';

const DocumentFilters = () => {
  const typeOptions = Object.entries(DOCUMENT_TYPES).map(([key, value]) => ({
    value,
    label: value
  }));

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SearchBox placeholder="بحث..." />
        <Select label="النوع" options={typeOptions} />
        <Select label="الحالة" options={[]} />
      </div>
    </div>
  );
};

export default DocumentFilters;
