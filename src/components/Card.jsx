import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  title,
  subtitle,
  headerActions,
  children,
  footer,
  className = '',
  variant = 'default',
  ...rest
}) => {
  const baseClasses =
    'rounded-lg shadow-sm bg-white dark:bg-gray-800 transition-all duration-200 ease-in-out';

  const variantClasses = {
    default: 'border border-gray-200 dark:border-gray-700',
    primary: 'border border-indigo-500',
    secondary: 'border border-gray-300',
    outline: 'border border-transparent',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...rest}
    >
      {(title || subtitle || headerActions) && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            {title && (
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="mt-2 sm:mt-0 sm:ml-4 flex items-center space-x-2">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  /** Title displayed in the card header */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /** Subtitle or secondary text in the header */
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /** Optional actions (buttons, icons) aligned to the right of the header */
  headerActions: PropTypes.node,
  /** Main content of the card */
  children: PropTypes.node.isRequired,
  /** Optional footer content */
  footer: PropTypes.node,
  /** Additional Tailwind classes for the outer wrapper */
  className: PropTypes.string,
  /** Variant styling: default, primary, secondary, outline */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'outline']),
};

Card.defaultProps = {
  title: null,
  subtitle: null,
  headerActions: null,
  footer: null,
  className: '',
  variant: 'default',
};

export default Card;