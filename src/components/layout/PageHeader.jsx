import { Link } from 'react-router-dom';
import Button from '../common/Button';

const PageHeader = ({ title, breadcrumbs, action }) => {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex mb-2" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 space-x-reverse">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                {crumb.path ? (
                  <Link to={crumb.path} className="text-sm text-blue-600 hover:text-blue-800">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-sm text-gray-600">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {action && (
          <Button onClick={action.onClick} variant={action.variant || 'primary'}>
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
