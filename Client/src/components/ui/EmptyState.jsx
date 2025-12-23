import React from 'react';
import Button from './Button';

/**
 * Empty State Component - For empty states
 */
const EmptyState = ({
  icon,
  title,
  description,
  action,
  actionLabel,
  className = '',
  ...props
}) => {
  const defaultIcon = (
    <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`} {...props}>
      <div className="w-20 h-20 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center mb-6 text-architectural">
        {icon || defaultIcon}
      </div>
      {title && (
        <h3 className="text-2xl font-semibold text-charcoal mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-architectural max-w-md mb-6">{description}</p>
      )}
      {action && actionLabel && (
        <Button variant="primary" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

