import { DOCUMENT_TYPE_ICONS } from '../../../constants/documentTypes';

const DocumentCard = ({ document }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4">
      <div className="text-4xl mb-3">{DOCUMENT_TYPE_ICONS[document.type]}</div>
      <h3 className="font-semibold text-gray-900 mb-2">{document.title}</h3>
      <p className="text-sm text-gray-600">{document.description}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>👁️ {document.views_count || 0}</span>
        <span>{document.size}</span>
      </div>
    </div>
  );
};

export default DocumentCard;
