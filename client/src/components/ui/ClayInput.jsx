<<<<<<< HEAD
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
=======
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * ClayInput - Recessed Claymorphic Form Input Field
 */
export const ClayInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  className = '',
  style = {},
  options = [], // for select type
  rows = 3, // for textarea
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const effectiveType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`clay-input-group ${className}`} style={{ marginBottom: '18px', ...style }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 600,
            fontSize: '0.92rem',
            color: 'var(--text-dark)',
          }}
        >
          {label} {required && <span style={{ color: 'var(--burst-orange)' }}>*</span>}
        </label>
      )}

      <div
        className="clay-inset"
        style={{
          display: 'flex',
          alignItems: type === 'textarea' ? 'flex-start' : 'center',
          padding: type === 'textarea' ? '12px 16px' : '0 16px',
          height: type === 'textarea' ? 'auto' : '52px',
          borderColor: error ? 'var(--burst-orange)' : undefined,
          backgroundColor: disabled ? '#EADBC6' : undefined,
          opacity: disabled ? 0.7 : 1,
        }}
      >
        {Icon && (
          <span
            style={{
              marginRight: '12px',
              marginTop: type === 'textarea' ? '4px' : 0,
              color: error ? 'var(--burst-orange)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon size={18} />
          </span>
        )}

        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dark)',
              fontSize: '0.96rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value || opt.id} value={opt.value || opt.id}>
                {opt.label || opt.name}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dark)',
              fontSize: '0.96rem',
              fontWeight: 500,
              resize: 'vertical',
            }}
            {...props}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={effectiveType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dark)',
              fontSize: '0.96rem',
              fontWeight: 500,
              height: '100%',
            }}
            {...props}
          />
        )}

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              marginLeft: '8px',
            }}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error ? (
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--burst-orange)',
            marginTop: '6px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          • {error}
        </p>
      ) : helperText ? (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>{helperText}</p>
      ) : null}
    </div>
  );
};
>>>>>>> origin/feature/module-a-farha-backend-new
