import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * ClayInput Component
 * Recessed claymorphic input field with focus glow, icon support, and animated error states.
 */
const ClayInput = ({
    label,
    error,
    helperText,
    type = "text",
    placeholder,
    value,
    onChange,
    name,
    required = false,
    disabled = false,
    icon: Icon,
    className = "",
    inputClassName = "",
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className={`w-full text-left font-georama ${className}`}>
            {label && (
                <div className="flex justify-between items-center mb-1.5 ml-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest/80">
                        {label} {required && <span className="text-burntOrange">*</span>}
                    </label>
                </div>
            )}

            <div
                className={`
                    clay-inset-well
                    relative flex items-center px-4 py-3
                    transition-all duration-200
                    ${isFocused ? "border-forest shadow-[inset_3px_3px_6px_rgba(53,92,69,0.16),inset_-3px_-3px_6px_rgba(255,255,255,0.95),0_0_0_3px_rgba(53,92,69,0.15)]" : ""}
                    ${error ? "border-burntOrange ring-2 ring-burntOrange/30 animate-shake-error" : ""}
                    ${disabled ? "opacity-60 cursor-not-allowed" : ""}
                `}
            >
                {Icon && (
                    <Icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${isFocused ? "text-burntOrange" : "text-forest/50"}`} />
                )}

                <input
                    type={actualType}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    required={required}
                    disabled={disabled}
                    className={`
                        w-full bg-transparent border-none outline-none text-forest placeholder-forest/40
                        text-sm font-medium
                        disabled:cursor-not-allowed
                        ${inputClassName}
                    `}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-forest/50 hover:text-burntOrange focus:outline-none transition-colors ml-2 p-1 rounded-lg cursor-pointer"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p className="mt-1.5 ml-1 text-xs font-bold text-burntOrange animate-in fade-in duration-200">
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p className="mt-1.5 ml-1 text-xs text-forest/60">
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default ClayInput;