export default function DatePicker({
  label, name, value, onChange, error, disabled = false,
  required = false, className = '', min, max,
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={name} name={name} type="date" value={value}
        onChange={onChange} disabled={disabled} min={min} max={max}
        className={`form-input ${error ? 'border-red-400' : ''}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
