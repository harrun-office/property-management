import React, { forwardRef } from 'react';

/**
 * Modern Input Component - International Design Standards
 * Supports floating labels, error states, and icons
 * 
 * TODO: DESIGN SYSTEM VIOLATIONS - Replace primitive tokens with semantic tokens:
 * - Line 22: border-stone-300, text-charcoal, placeholder-architectural, focus:border-obsidian-500, focus:ring-obsidian-500
 *   Should use: border-[var(--ui-border-default)], text-[var(--ui-text-primary)], placeholder-[var(--ui-text-muted)], focus:border-[var(--ui-action-primary)], focus:ring-[var(--ui-focus)]
 * - Line 23: border-error-500, text-charcoal, placeholder-architectural, focus:border-error-500, focus:ring-error-500
 *   Should use: border-[var(--ui-error)], text-[var(--ui-text-primary)], placeholder-[var(--ui-text-muted)], focus:border-[var(--ui-error)], focus:ring-[var(--ui-focus)]
 * - Line 24: border-eucalyptus-500, text-charcoal, placeholder-architectural, focus:border-eucalyptus-500, focus:ring-eucalyptus-500
 *   Should use: border-[var(--ui-success)], text-[var(--ui-text-primary)], placeholder-[var(--ui-text-muted)], focus:border-[var(--ui-success)], focus:ring-[var(--ui-focus)]
 * - Line 51: text-architectural
 *   Should use: text-[var(--ui-text-muted)]
 * - Line 59: text-charcoal
 *   Should use: text-[var(--ui-text-primary)]
 * - Line 61: text-error-500
 *   Should use: text-[var(--ui-error)]
 * - Line 75: text-error-500
 *   Should use: text-[var(--ui-error)]
 * - Line 83: text-architectural
 *   Should use: text-[var(--ui-text-muted)]
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
    default: 'border-[var(--ui-border-default)] bg-[var(--ui-bg-surface)] text-[var(--ui-text-primary)] placeholder-[var(--ui-text-muted)] focus:border-[var(--ui-action-primary)] focus:ring-[var(--ui-focus)]',
    error: 'border-[var(--ui-error)] bg-[var(--ui-bg-surface)] text-[var(--ui-text-primary)] placeholder-[var(--ui-text-muted)] focus:border-[var(--ui-error)] focus:ring-[var(--ui-focus)]',
    success: 'border-[var(--ui-success)] bg-[var(--ui-bg-surface)] text-[var(--ui-text-primary)] placeholder-[var(--ui-text-muted)] focus:border-[var(--ui-success)] focus:ring-[var(--ui-focus)]',
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

