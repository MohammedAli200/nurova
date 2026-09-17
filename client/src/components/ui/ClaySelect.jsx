import { ChevronDown } from "lucide-react";

/**
 * ClaySelect Component
 * Recessed claymorphic dropdown select with custom arrow and consistent styling.
 */
const ClaySelect = ({
    label,
    error,
    helperText,
    value,
    onChange,
    name,
    options = [],
    placeholder = "Select an option",
    required = false,
    disabled = false,
    className = "",
    selectClassName = "",
    children,
    ...props
}) => {
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
                    ${error ? "border-burntOrange ring-2 ring-burntOrange/30" : ""}
                    ${disabled ? "opacity-60 cursor-not-allowed" : ""}
                `}
            >
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className={`
                        w-full bg-transparent border-none outline-none text-forest text-sm font-medium
                        appearance-none cursor-pointer pr-8
                        disabled:cursor-not-allowed
                        ${selectClassName}
                    `}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled className="bg-warmBeige text-forest/50">
                            {placeholder}
                        </option>
                    )}
                    {children
                        ? children
                        : options.map((opt) => {
                            const val = typeof opt === "object" ? opt.value : opt;
                            const lbl = typeof opt === "object" ? opt.label : opt;
                            return (
                                <option key={val} value={val} className="bg-warmBeige text-forest font-medium">
                                    {lbl}
                                </option>
                            );
                        })}
                </select>

                <ChevronDown className="w-4 h-4 text-forest/60 absolute right-4 pointer-events-none" />
            </div>

            {error && (
                <p className="mt-1.5 ml-1 text-xs font-semibold text-burntOrange">
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

export default ClaySelect;
