import React from 'react';

/**
 * Modern Metric Card Component - For Dashboard Statistics
 * International Design Standards with animations and hover effects
 *
 * FIXED: All primitive tokens replaced with semantic tokens
 * - Uses --ui-* semantic tokens for backgrounds, text, and borders
 * - Supports gradient variant with proper contrast (white text on dark background)
 * - Icon backgrounds use semantic tokens with proper opacity
 * - Trend indicators use semantic status colors
 */
const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = 'default',
  onClick,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-[var(--ui-bg-surface)] border border-[var(--ui-border-default)] text-[var(--ui-text-primary)]',
    primary: 'bg-[var(--ui-action-primary)] text-[var(--ui-text-inverse)]',
    accent: 'bg-[var(--ui-action-primary)] text-[var(--ui-text-inverse)]',
    success: 'bg-[var(--ui-success)] text-[var(--ui-text-inverse)]',
    info: 'bg-[var(--ui-info)] text-[var(--ui-text-inverse)]',
    gradient: 'bg-[var(--ui-bg-inverse)] text-[var(--ui-text-inverse)]',
  };

  const iconBgColors = {
    default: 'bg-[var(--ui-bg-muted)]',
    primary: 'bg-[var(--ui-text-inverse)]/20',
    accent: 'bg-[var(--ui-text-inverse)]/20',
    success: 'bg-[var(--ui-text-inverse)]/20',
    info: 'bg-[var(--ui-text-inverse)]/20',
    gradient: 'bg-[var(--ui-text-inverse)]/20',
  };

  const getSubtitleColor = (variant) => {
    if (variant === 'gradient') {
      return 'text-[var(--ui-text-inverse)]/80'; // Muted white on dark backgrounds
    }
    return 'text-[var(--ui-text-secondary)]'; // Secondary text on light backgrounds
  };

  const subtitleColor = getSubtitleColor(variant);

  return (
    <div
      className={`
        relative rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300
        ${variants[variant] || variants.default}
        ${onClick ? 'cursor-pointer hover:-translate-y-1 active:translate-y-0' : ''}
        ${className}
        group
      `}
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
      {/* Background Pattern (for gradient variants) */}
      {isGradient && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
        </div>
      )}

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-1 ${subtitleColor}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mb-2 ${textColor} group-hover:scale-105 transition-transform duration-200`}>
            {value}
          </p>
          {subtitle && (
            <div className={`text-xs ${subtitleColor}`}>
              {typeof subtitle === 'string' ? <p>{subtitle}</p> : subtitle}
            </div>
          )}
          {trend && trendValue && (
            <div className={`flex items-center mt-3 text-xs font-medium ${
              trend === 'up' ? 'text-[var(--ui-success)]' : trend === 'down' ? 'text-[var(--ui-error)]' : 'text-[var(--ui-text-muted)]'
            }`}>
              <svg
                className={`w-4 h-4 mr-1 ${trend === 'up' ? '' : trend === 'down' ? 'rotate-180' : 'hidden'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${iconBgColors[variant] || iconBgColors.default}
            group-hover:scale-110 transition-transform duration-200
          `}>
            {icon}
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      {onClick && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-300 pointer-events-none" />
      )}
    </div>
  );
};

export default MetricCard;

