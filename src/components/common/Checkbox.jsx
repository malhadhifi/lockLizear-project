export default function Checkbox({ label, name, checked, onChange, disabled = false }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox" name={name} checked={checked}
        onChange={onChange} disabled={disabled}
        className="w-4 h-4 rounded border-slate-300 text-blue-600
                   focus:ring-blue-500 cursor-pointer"
      />
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
}
