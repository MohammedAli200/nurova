<<<<<<< HEAD
/**
 * ClayCard Component
 * Refined claymorphic card with 3 tactile elevation levels.
 */
const ClayCard = ({
    children,
    level = "2", // "1" | "2" | "3"
    interactive = false,
    className = "",
    ...props
}) => {
    const levelClasses = {
        "1": "clay-surface-1",
        "2": "clay-surface-2",
        "3": "clay-surface-3",
    };

    return (
        <div
            className={`
                ${levelClasses[level] || levelClasses["2"]}
                ${interactive ? "clay-card-interactive cursor-pointer" : ""}
                p-6 sm:p-8
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
};

export default ClayCard;
=======
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
>>>>>>> origin/feature/module-a-farha-backend-new
