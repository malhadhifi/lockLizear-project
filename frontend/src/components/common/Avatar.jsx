import { getInitials } from '@/utils/helpers';

const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };

export default function Avatar({ name, src, size = 'md', className = '' }) {
  if (src) {
    return <img src={src} alt={name} className={`rounded-full object-cover ${sizes[size]} ${className}`} />;
  }
  return (
    <div className={`rounded-full bg-blue-600 text-white flex items-center justify-center
                     font-semibold ${sizes[size]} ${className}`}>
      {getInitials(name)}
    </div>
  );
}
