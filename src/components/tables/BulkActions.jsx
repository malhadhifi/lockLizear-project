import Button from '@/components/common/Button';

export default function BulkActions({ selectedCount, actions = [], onClear }) {
  if (!selectedCount) return null;
  return (
    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200
                    rounded-lg mb-4">
      <span className="text-sm text-blue-700 font-medium">
        {selectedCount} selected
      </span>
      <div className="flex gap-2">
        {actions.map((action, i) => (
          <Button key={i} variant={action.variant || 'secondary'}
                  size="sm" onClick={action.onClick} icon={action.icon}>
            {action.label}
          </Button>
        ))}
      </div>
      <button onClick={onClear} className="ml-auto text-slate-400 hover:text-slate-600">&times;</button>
    </div>
  );
}
