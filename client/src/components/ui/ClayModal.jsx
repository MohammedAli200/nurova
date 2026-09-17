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
