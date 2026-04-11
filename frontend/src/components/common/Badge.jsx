const variantClasses = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  expired: "bg-orange-100 text-orange-800",
  pending: "bg-yellow-100 text-yellow-800",
  suspend: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  default: "bg-slate-100 text-slate-700",
};

export default function Badge({ label, variant = "default", className = "" }) {
  return (
    <span
      className={`badge ${variantClasses[variant] || variantClasses.default} ${className}`}
    >
      {label}
    </span>
  );
}
