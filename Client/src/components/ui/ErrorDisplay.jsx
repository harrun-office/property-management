import React from 'react';
import Button from './Button';

/**
 * Error Display Component - For error states
 */
const ErrorDisplay = ({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try Again',
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`} {...props}>
      <div className="w-20 h-20 bg-error-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-charcoal mb-2">{title}</h3>
      {message && (
        <p className="text-architectural max-w-md mb-6">{message}</p>
      )}
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorDisplay;

