export default function Textarea({
  label, name, value, onChange, placeholder, error,
  disabled = false, rows = 4, required = false, className = '',
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={name} name={name} rows={rows} value={value}
        onChange={onChange} placeholder={placeholder}
        disabled={disabled} required={required}
        className={`form-input resize-none ${error ? 'border-red-400' : ''}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
