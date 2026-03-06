import { useState } from 'react';

export default function Tooltip({ children, text, position = 'top' }) {
  const [visible, setVisible] = useState(false);
  const positions = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full  left-1/2 -translate-x-1/2 mt-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  };
  return (
    <div className="relative inline-flex"
         onMouseEnter={() => setVisible(true)}
         onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <span className={`absolute ${positions[position]} z-50 whitespace-nowrap
                          bg-slate-800 text-white text-xs rounded px-2 py-1`}>
          {text}
        </span>
      )}
    </div>
  );
}
