import React from "react";
import { Loader2 } from "lucide-react";

/**
 * ClayButton Component
 * Tactile claymorphic button with smooth physics, loading spinners, and multi-variant styling.
 */
const ClayButton = ({
    children,
    type = "button",
    variant = "forest",
    size = "md",
    fullWidth = true,
    disabled = false,
    loading = false,
    loadingText,
    icon: Icon,
    iconPosition = "left",
    className = "",
    onClick,
    ...props
}) => {
    const variantClasses = {
        forest: "clay-btn-forest",
        orange: "clay-btn-orange",
        beige: "clay-btn-beige",
        success: "clay-btn-success",
        danger: "clay-btn-danger",
        ghost: "bg-transparent text-forest hover:bg-forest/10 active:bg-forest/15 rounded-2xl transition-colors active:scale-95",
    };

    const sizeClasses = {
        sm: "py-2 px-3.5 text-xs rounded-xl font-bold",
        md: "py-2.5 px-5 text-sm font-bold rounded-2xl",
        lg: "py-3.5 px-6 text-base font-bold rounded-2xl",
    };

    const handleClick = (e) => {
        if (loading || disabled) {
            e.preventDefault();
            return;
        }

        if (onClick) onClick(e);
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={handleClick}
            className={`
                ${fullWidth ? "w-full" : "inline-flex"}
                ${variantClasses[variant] || variantClasses.forest}
                ${sizeClasses[size] || sizeClasses.md}
                flex items-center justify-center gap-2
                cursor-pointer select-none font-georama
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:transform-none disabled:shadow-none
                ${className}
            `}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin text-current flex-shrink-0" />
                    <span>{loadingText || "Processing..."}</span>
                </>
            ) : (
                <>
                    {Icon && iconPosition === "left" && (
                        <Icon className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    )}

                    <span>{children}</span>

                    {Icon && iconPosition === "right" && (
                        <Icon className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                    )}
                </>
            )}
        </button>
    );
};

export default ClayButton;