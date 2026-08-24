import React from 'react';

/**
 * ClayBadge - Highlight Pill Badge with Bitcount Single style highlight typography
 * @param {'forest' | 'orange' | 'beige' | 'sand'} variant
 */
export const ClayBadge = ({
  children,
  variant = 'forest',
  icon: Icon,
  className = '',
  style = {},
  pulse = false,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'orange':
        return 'clay-badge-orange';
      case 'beige':
        return 'clay-badge-beige';
      case 'sand':
        return 'clay-badge-sand';
      case 'forest':
      default:
        return 'clay-badge-forest';
    }
  };

  return (
    <span
      className={`clay-badge ${getVariantClass()} ${pulse ? 'pulse-badge' : ''} ${className}`}
      style={style}
      {...props}
    >
      {Icon && <Icon size={13} style={{ strokeWidth: 2.5 }} />}
      {children}
    </span>
  );
};
