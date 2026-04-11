import ReactSelect from 'react-select';

export default function MultiSelect({
  label, name, value, onChange, options = [], error,
  placeholder = 'Select...', className = '', required = false,
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <ReactSelect
        isMulti options={options} value={value} onChange={onChange}
        placeholder={placeholder} classNamePrefix="react-select"
        styles={{
          control: (base) => ({ ...base, minHeight: '40px', fontSize: '14px' }),
        }}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
