import React from 'react'

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  noPadding = false,
  hover = false,
  className = '',
}) => {
  return (
    <div
      className={`bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
        hover ? 'hover:shadow-md transition-shadow' : ''
      } ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  )
}

export default Card
