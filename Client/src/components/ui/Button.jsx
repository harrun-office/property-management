import React from 'react';

/**
 * Modern Button Component - International Design Standards
 * Supports multiple variants, sizes, and states
 * 
 * TODO: DESIGN SYSTEM VIOLATIONS - Replace primitive tokens with semantic tokens:
 * - Line 24: bg-obsidian-500, text-white, hover:bg-obsidian-600, focus:ring-obsidian-500, active:bg-obsidian-700
 *   Should use: bg-[var(--ui-action-primary)], text-[var(--ui-text-inverse)], hover:bg-[var(--ui-action-primary-hover)]
 * - Line 25: bg-stone-200, text-charcoal, hover:bg-stone-300, focus:ring-stone-500, active:bg-stone-400, border-stone-300
 *   Should use: bg-[var(--ui-action-secondary)], text-[var(--ui-text-primary)], border-[var(--ui-border-default)]
 * - Line 26: bg-brass-500, hover:bg-brass-600, focus:ring-brass-500, active:bg-brass-700
 *   Should use: bg-[var(--ui-action-primary)] (or create --ui-action-accent if needed)
 * - Line 27: bg-eucalyptus-500, hover:bg-eucalyptus-600, focus:ring-eucalyptus-500, active:bg-eucalyptus-700
 *   Should use: bg-[var(--ui-success)] for success variant
 * - Line 28: bg-error-500, hover:bg-error-600, focus:ring-error-500, active:bg-error-700
 *   Should use: bg-[var(--ui-error)], hover:bg-[var(--ui-error)] with opacity
 * - Line 29: border-obsidian-500, text-obsidian-500, hover:bg-obsidian-50, focus:ring-obsidian-500, active:bg-obsidian-100
 *   Should use: border-[var(--ui-action-primary)], text-[var(--ui-action-primary)], hover:bg-[var(--ui-bg-muted)]
 * - Line 30: text-obsidian-500, hover:bg-obsidian-50, focus:ring-obsidian-500, active:bg-obsidian-100
 *   Should use: text-[var(--ui-action-primary)], hover:bg-[var(--ui-bg-muted)]
 * - Line 31: text-obsidian-500, hover:text-obsidian-600
 *   Should use: text-[var(--ui-link)], hover:text-[var(--ui-link-hover)]
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transform';

  const variants = {
    primary: 'bg-[var(--brand-accent)] text-white hover:bg-[var(--brand-accent-dark)] focus:ring-[var(--brand-accent)]/20 focus:ring-offset-2 active:bg-[var(--brand-accent-dark)] shadow-soft hover:shadow-medium hover:-translate-y-0.5',
    secondary: 'bg-[var(--ui-bg-surface)] text-[var(--ui-text-primary)] hover:bg-[var(--ui-bg-muted)] focus:ring-[var(--brand-accent)]/20 focus:ring-offset-2 active:bg-[var(--ui-bg-secondary)] border border-[var(--ui-border-default)] shadow-xs hover:shadow-soft',
    accent: 'bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-accent-dark)] text-white hover:from-[var(--brand-accent-dark)] hover:to-[var(--brand-accent)] focus:ring-white/20 focus:ring-offset-2 active:from-[var(--brand-accent-dark)] active:to-[var(--brand-accent)] shadow-medium hover:shadow-strong hover:-translate-y-0.5',
    success: 'bg-[var(--ui-success)] text-white hover:bg-[var(--ui-success)]/90 focus:ring-[var(--ui-success)]/20 focus:ring-offset-2 active:bg-[var(--ui-success)]/95 shadow-soft hover:shadow-medium',
    danger: 'bg-[var(--ui-error)] text-white hover:bg-[var(--ui-error)]/90 focus:ring-[var(--ui-error)]/20 focus:ring-offset-2 active:bg-[var(--ui-error)]/95 shadow-soft hover:shadow-medium',
    outline: 'bg-transparent border-2 border-[var(--brand-accent)] text-[var(--brand-accent)] hover:bg-[var(--brand-accent)] hover:text-white focus:ring-[var(--brand-accent)]/20 focus:ring-offset-2 active:bg-[var(--brand-accent)] active:text-white shadow-xs hover:shadow-soft',
    ghost: 'bg-transparent text-[var(--brand-accent)] hover:bg-stone-100 focus:ring-[var(--brand-accent)]/20 focus:ring-offset-2 active:bg-stone-200 shadow-none hover:shadow-xs',
    link: 'bg-transparent text-[var(--brand-accent)] hover:text-[var(--brand-accent-dark)] underline-offset-4 hover:underline focus:ring-[var(--brand-accent)]/20 focus:ring-offset-2 p-0 shadow-none',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const iconElement = icon && (
    <span className={`${iconSizes[size]} ${loading ? 'opacity-0' : ''} ${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`}>
      {icon}
    </span>
  );

  const loadingSpinner = loading && (
    <svg
      className={`animate-spin ${iconSizes[size]} ${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loadingSpinner || (iconPosition === 'left' && iconElement)}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
      {iconPosition === 'right' && iconElement}
    </button>
  );
};

export default Button;

