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
