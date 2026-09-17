/**
 * ClayTextarea Component
 * Recessed claymorphic textarea with customizable rows and smooth focus state.
 */
const ClayTextarea = ({
    label,
    error,
    helperText,
    placeholder,
    value,
    onChange,
    name,
    rows = 4,
    required = false,
    disabled = false,
    className = "",
    textareaClassName = "",
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
                    relative p-3.5
                    ${error ? "border-burntOrange ring-2 ring-burntOrange/30" : ""}
                    ${disabled ? "opacity-60 cursor-not-allowed" : ""}
                `}
            >
                <textarea
                    name={name}
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className={`
                        w-full bg-transparent border-none outline-none text-forest placeholder-forest/40
                        text-sm font-medium resize-none
                        disabled:cursor-not-allowed
                        ${textareaClassName}
                    `}
                    {...props}
                />
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

export default ClayTextarea;
