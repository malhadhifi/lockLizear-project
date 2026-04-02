export default function ToggleSwitch({ label, name, checked, onChange, hint, disabled = false }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange({ target: { name, checked: !checked } })}
        className={`relative inline-flex h-6 w-11 items-center rounded-full
                    transition-colors duration-200 focus:outline-none
                    ${checked ? 'bg-blue-600' : 'bg-slate-300'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm
                      transform transition-transform duration-200
                      ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
}
