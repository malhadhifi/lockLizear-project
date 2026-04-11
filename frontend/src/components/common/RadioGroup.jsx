export default function RadioGroup({ label, name, value, onChange, options = [] }) {
  return (
    <div className="mb-4">
      {label && <p className="form-label">{label}</p>}
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio" name={name} value={opt.value}
              checked={value === opt.value} onChange={onChange}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
