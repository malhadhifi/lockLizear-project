export default function Input({
  label, name, type = 'text', value, onChange, placeholder,
  error, disabled = false, required = false, className = '', hint,
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={name} name={name} type={type} value={value}
        onChange={onChange} placeholder={placeholder}
        disabled={disabled} required={required}
        className={`form-input ${error ? 'border-red-400 focus:ring-red-400' : ''}
                    ${disabled ? 'bg-slate-50 cursor-not-allowed' : ''}`}
      />
      {hint  && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
