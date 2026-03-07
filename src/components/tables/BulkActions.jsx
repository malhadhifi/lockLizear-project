import Button from '../common/Button';
import { useState } from 'react';

const BulkActions = ({ selectedItems, actions, onClearSelection }) => {
  if (selectedItems.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-sm font-medium text-blue-900">
            تم تحديد {selectedItems.length} عنصر
          </span>
          <button
            onClick={onClearSelection}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            إلغاء التحديد
          </button>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={() => action.onClick(selectedItems)}
              variant={action.variant || 'outline'}
              size="sm"
            >
              {action.icon && <span className="mr-1">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BulkActions;
