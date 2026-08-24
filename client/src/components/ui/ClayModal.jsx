import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * ClayModal - Tactile Claymorphic Modal Dialog
 */
export const ClayModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '550px',
  showClose = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(43, 38, 33, 0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out forwards',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="clay-card"
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          background: 'var(--warm-beige)',
          position: 'relative',
          border: '3px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '16px 24px 48px rgba(160, 130, 100, 0.5), -12px -12px 30px rgba(255, 255, 255, 0.95)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '20px',
            borderBottom: '2px dashed rgba(53, 92, 69, 0.15)',
            paddingBottom: '14px',
          }}
        >
          <div>
            {title && (
              <h3 style={{ color: 'var(--forest-primary)', fontSize: '1.4rem', fontWeight: 700 }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                {subtitle}
              </p>
            )}
          </div>

          {showClose && (
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: 'var(--sand-light)',
                boxShadow: '3px 3px 6px rgba(188, 163, 131, 0.4), -2px -2px 6px rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                transition: 'all 0.15s ease',
              }}
              title="Close modal"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};
