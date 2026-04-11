import React from 'react'

const Loader = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  }

  const colorClasses = {
    primary: 'border-primary-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-500 border-t-transparent',
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${
          sizeClasses[size]
        } ${colorClasses[color]} rounded-full animate-spin`}
      />
    </div>
  )
}

export default Loader
