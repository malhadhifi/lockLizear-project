export default function NumberInput({
  label, name, value, onChange, error, min = 0, max,
  step = 1, disabled = false, required = false, className = '',
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={name} name={name} type="number" value={value}
        onChange={onChange} min={min} max={max} step={step}
        disabled={disabled}
        className={`form-input ${error ? 'border-red-400' : ''}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
