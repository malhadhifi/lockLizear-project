export default function Select({
  label, name, value, onChange, options = [], error,
  disabled = false, required = false, placeholder = 'Select...', className = '',
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={name} name={name} value={value} onChange={onChange}
        disabled={disabled} required={required}
        className={`form-input ${error ? 'border-red-400' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
