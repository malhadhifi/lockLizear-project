import Tooltip from '@/components/common/Tooltip';

export default function TableActions({ actions = [] }) {
  return (
    <div className="flex items-center gap-2">
      {actions.map((action, i) => (
        action.hidden ? null : (
          <Tooltip key={i} text={action.label}>
            <button
              onClick={(e) => { e.stopPropagation(); action.onClick(); }}
              disabled={action.disabled}
              className={`p-1.5 rounded-lg text-sm transition-colors
                ${action.variant === 'danger'
                  ? 'text-red-500 hover:bg-red-50'
                  : 'text-slate-500 hover:bg-slate-100'}
                disabled:opacity-30`}
            >
              {action.icon}
            </button>
          </Tooltip>
        )
      ))}
    </div>
  );
}
