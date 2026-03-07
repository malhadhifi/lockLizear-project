import Button from '../common/Button';

const TableActions = ({ actions, data }) => {
  return (
    <div className="flex items-center space-x-2 space-x-reverse">
      {actions.map((action, index) => (
        <Button
          key={index}
          onClick={() => action.onClick(data)}
          variant={action.variant || 'outline'}
          size="sm"
          disabled={action.disabled?.(data)}
        >
          {action.icon && <span className="mr-1">{action.icon}</span>}
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default TableActions;
