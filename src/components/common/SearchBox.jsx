import { useState } from 'react';
import useDebounce from '@/hooks/useDebounce';

export default function SearchBox({ placeholder = 'Search...', onSearch, className = '' }) {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);

  // Trigger search when debounced value changes
  useState(() => { onSearch && onSearch(debounced); }, [debounced]);

  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
      <input
        type="text" value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="form-input pl-9 pr-4"
      />
    </div>
  );
}
