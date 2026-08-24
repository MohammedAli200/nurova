import React from 'react';

/**
 * ClayCard - Tactile Claymorphic Card Container
 * @param {'sand' | 'beige'} variant
 * @param {string} className
 */
export const ClayCard = ({
  children,
  variant = 'beige',
  className = '',
  style = {},
  onClick,
  hoverable = true,
  ...props
}) => {
  const baseClass = variant === 'sand' ? 'clay-card-sand' : 'clay-card';
  const hoverClass = hoverable ? '' : 'no-hover';

  return (
    <div
      className={`${baseClass} ${hoverClass} ${className}`}
      style={{
        padding: '28px',
        position: 'relative',
        ...style,
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
