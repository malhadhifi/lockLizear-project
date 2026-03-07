import SearchBox from '../common/SearchBox';
import Select from '../common/Select';
import Button from '../common/Button';

const TableFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {filters.map((filter) => {
          if (filter.type === 'search') {
            return (
              <SearchBox
                key={filter.key}
                placeholder={filter.placeholder}
                value={filter.value}
                onChange={(value) => onFilterChange(filter.key, value)}
              />
            );
          }

          if (filter.type === 'select') {
            return (
              <Select
                key={filter.key}
                label={filter.label}
                options={filter.options}
                value={filter.value}
                onChange={(value) => onFilterChange(filter.key, value)}
              />
            );
          }

          return null;
        })}

        {onReset && (
          <Button onClick={onReset} variant="outline">
            إعادة تعيين
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableFilters;
