import React from "react";

/**
 * ClaySkeleton Component
 * Tactile placeholder loaders for claymorphic interfaces with continuous shimmer animations.
 */
export const ClaySkeleton = ({
    className = "",
    variant = "rectangle", // "rectangle" | "circle" | "text"
}) => {
    const variantClasses = {
        rectangle: "rounded-2xl",
        circle: "rounded-full",
        text: "h-4 rounded-lg",
    };

    return (
        <div
            className={`
                clay-skeleton-shimmer
                shadow-[inset_2px_2px_4px_rgba(53,92,69,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.7)]
                border border-white/40
                ${variantClasses[variant] || variantClasses.rectangle}
                ${className}
            `}
        />
    );
};

export default ClaySkeleton;
