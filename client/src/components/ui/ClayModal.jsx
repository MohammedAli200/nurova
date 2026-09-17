<<<<<<< HEAD
import React, { useEffect } from "react";
import { X } from "lucide-react";
import ClayCard from "./ClayCard";

/**
 * ClayModal Component
 * Level 3 Claymorphic modal dialog with smooth scale entrance, backdrop blur, and accessible key controls.
 */
const ClayModal = ({
    isOpen = true,
    onClose,
    title,
    subtitle,
    children,
    maxWidth = "max-w-xl",
    showCloseButton = true,
    className = "",
}) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && onClose) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-georama">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-forest/30 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog Card */}
            <div className={`relative w-full ${maxWidth} z-10 my-auto animate-modal-in`}>
                <ClayCard
                    level="3"
                    className={`max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-white/80 p-6 sm:p-8 ${className}`}
                >
                    {(title || showCloseButton) && (
                        <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-forest/10">
                            <div>
                                {subtitle && (
                                    <p className="font-bitcount text-burntOrange text-xs sm:text-sm tracking-wider uppercase font-bold">
                                        {subtitle}
                                    </p>
                                )}
                                {title && (
                                    <h2 className="text-xl sm:text-2xl font-bold text-forest mt-0.5">
                                        {title}
                                    </h2>
                                )}
                            </div>

                            {showCloseButton && onClose && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 rounded-xl text-forest/60 hover:text-forest bg-warmBeige shadow-[3px_3px_6px_rgba(53,92,69,0.1),-3px_-3px_6px_rgba(255,255,255,0.8)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1)] transition-all cursor-pointer"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    )}

                    <div>{children}</div>
                </ClayCard>
            </div>
        </div>
    );
};

export default ClayModal;
=======
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
>>>>>>> origin/feature/module-a-farha-backend-new
