import LoadingSpinner from './LoadingSpinner';

export default function Button({
  children, onClick, type = 'button', variant = 'primary',
  size = 'md', disabled = false, loading = false, className = '', icon,
}) {
  const variants = {
    primary:   'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    danger:    'bg-red-600 text-white hover:bg-red-700',
    success:   'bg-green-600 text-white hover:bg-green-700',
    ghost:     'text-slate-600 hover:bg-slate-100',
    outline:   'border border-slate-300 text-slate-700 hover:bg-slate-50',
  };
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 font-medium rounded-lg
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? <LoadingSpinner size="sm" /> : icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
