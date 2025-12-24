import React from 'react';

/**
 * Modern Card Component - International Design Standards
 * Supports multiple variants and interactive states
 * 
 * TODO: DESIGN SYSTEM VIOLATIONS - Replace primitive tokens with semantic tokens:
 * - Line 16: text-charcoal
 *   Should use: text-[var(--ui-text-primary)]
 * - Line 19-22: border-stone-200, border-stone-300
 *   Should use: border-[var(--ui-border-default)], border-[var(--ui-border-strong)]
 * - Line 73: text-charcoal
 *   Should use: text-[var(--ui-text-primary)]
 * - Line 79: text-architectural
 *   Should use: text-[var(--ui-text-muted)]
 * - Line 91: border-stone-200
 *   Should use: border-[var(--ui-border-default)]
 */
const Card = ({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'rounded-xl transition-all duration-200 text-[var(--ui-text-primary)]';
  
  const variants = {
    default: 'bg-[var(--ui-bg-surface)] border border-[var(--ui-border-default)] shadow-sm',
    elevated: 'bg-[var(--ui-bg-surface)] border border-[var(--ui-border-default)] shadow-md',
    outlined: 'bg-[var(--ui-bg-surface)] border-2 border-[var(--ui-border-strong)]',
    filled: 'bg-[var(--ui-bg-muted)] border border-[var(--ui-border-default)]',
    glass: 'glass-effect shadow-lg',
  };
  
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverStyles = hover || onClick
    ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
    : '';

  const cardClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${paddings[padding]}
    ${hoverStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Sub-components
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Title = ({ children, className = '', ...props }) => (
  <h3 className={`text-xl font-semibold text-[var(--ui-text-primary)] mb-2 ${className}`} {...props}>
    {children}
  </h3>
);

Card.Description = ({ children, className = '', ...props }) => (
  <p className={`text-architectural text-sm ${className}`} {...props}>
    {children}
  </p>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`mt-4 pt-4 border-t border-stone-200 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;

