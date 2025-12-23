import React from 'react';

/**
 * Skeleton Loading Component - For loading states
 */
const Skeleton = ({ variant = 'text', width, height, className = '', ...props }) => {
  const baseStyles = 'animate-skeleton bg-gradient-to-r from-[var(--color-bg-secondary)] via-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)] bg-[length:200%_100%] rounded';
  
  const variants = {
    text: 'h-4',
    heading: 'h-6',
    title: 'h-8',
    paragraph: 'h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    rounded: 'rounded-xl',
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
      {...props}
    />
  );
};

// Skeleton Card Component
Skeleton.Card = ({ className = '', ...props }) => (
  <div className={`bg-[var(--color-surface)] rounded-xl shadow-md p-6 border border-stone-200 ${className}`} {...props}>
    <Skeleton variant="title" width="60%" className="mb-4" />
    <Skeleton variant="text" width="100%" className="mb-2" />
    <Skeleton variant="text" width="80%" />
  </div>
);

// Skeleton Metric Card
Skeleton.MetricCard = ({ className = '', ...props }) => (
  <div className={`bg-[var(--color-surface)] rounded-2xl shadow-md p-6 border border-stone-200 ${className}`} {...props}>
    <Skeleton variant="text" width="40%" className="mb-3" />
    <Skeleton variant="heading" width="60%" className="mb-2" />
    <Skeleton variant="text" width="50%" />
  </div>
);

// Skeleton List Item
Skeleton.ListItem = ({ className = '', ...props }) => (
  <div className={`flex items-center space-x-4 ${className}`} {...props}>
    <Skeleton variant="circular" width="48px" height="48px" />
    <div className="flex-1">
      <Skeleton variant="text" width="60%" className="mb-2" />
      <Skeleton variant="text" width="40%" />
    </div>
  </div>
);

export default Skeleton;

