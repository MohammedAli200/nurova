import React from 'react';

/**
 * ClayButton - Tactile Claymorphic Squishy Button
 * @param {'forest' | 'orange' | 'beige'} variant
 * @param {'sm' | 'md' | 'lg'} size
 * @param {boolean} fullWidth
 * @param {boolean} loading
 */
export const ClayButton = ({
  children,
  variant = 'forest',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  style = {},
  onClick,
  type = 'button',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'orange':
        return 'clay-btn-orange';
      case 'beige':
        return 'clay-btn-beige';
      case 'forest':
      default:
        return 'clay-btn-forest';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '8px 16px', fontSize: '0.85rem', borderRadius: '16px' };
      case 'lg':
        return { padding: '16px 32px', fontSize: '1.1rem', borderRadius: '22px' };
      case 'md':
      default:
        return { padding: '13px 26px', fontSize: '0.96rem', borderRadius: '20px' };
    }
  };

  return (
    <button
      type={type}
      className={`clay-btn ${getVariantClass()} ${className}`}
      style={{
        ...getSizeStyles(),
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled || loading ? 0.65 : 1,
        pointerEvents: disabled || loading ? 'none' : 'auto',
        ...style,
      }}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <svg
            className="animate-spin"
            style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="30"
              strokeDashoffset="10"
              strokeLinecap="round"
            />
          </svg>
          Loading...
        </span>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </button>
  );
};
