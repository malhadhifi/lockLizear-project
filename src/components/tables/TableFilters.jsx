import SearchBox from '@/components/common/SearchBox';
import Select   from '@/components/common/Select';

export default function TableFilters({ onSearch, filters = [], onFilterChange, values = {} }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4 items-center">
      <SearchBox onSearch={onSearch} className="w-64" />
      {filters.map((f) => (
        <Select
          key={f.name}
          name={f.name}
          value={values[f.name] || ''}
          onChange={(e) => onFilterChange(f.name, e.target.value)}
          options={f.options}
          placeholder={f.placeholder}
          className="!mb-0 w-44"
        />
      ))}
    </div>
  );
}
