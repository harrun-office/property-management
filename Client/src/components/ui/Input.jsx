import React, { forwardRef } from 'react';

/**
 * Modern Input Component - International Design Standards
 * Supports floating labels, error states, and icons
 */
const Input = forwardRef(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
  
  const variants = {
    default: 'border-stone-300 bg-[var(--color-surface)] text-charcoal placeholder-architectural focus:border-obsidian-500 focus:ring-obsidian-500',
    error: 'border-error-500 bg-[var(--color-surface)] text-charcoal placeholder-architectural focus:border-error-500 focus:ring-error-500',
    success: 'border-eucalyptus-500 bg-[var(--color-surface)] text-charcoal placeholder-architectural focus:border-eucalyptus-500 focus:ring-eucalyptus-500',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const inputVariant = error ? 'error' : variant;
  const inputClasses = `
    ${baseStyles}
    ${variants[inputVariant]}
    ${sizes[size]}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const iconElement = icon && (
    <div className={`absolute ${iconPosition === 'left' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-architectural ${iconSizes[size]}`}>
      {icon}
    </div>
  );

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          {label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {iconElement}
        <input
          ref={ref}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id || 'input'}-error` : helperText ? `${props.id || 'input'}-helper` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${props.id || 'input'}-error`} className="mt-1.5 text-sm text-error-500 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${props.id || 'input'}-helper`} className="mt-1.5 text-sm text-architectural">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

