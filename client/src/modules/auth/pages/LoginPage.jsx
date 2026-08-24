import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { ClayCard } from '../../../components/ui/ClayCard';
import { ClayButton } from '../../../components/ui/ClayButton';
import { ClayInput } from '../../../components/ui/ClayInput';
import { ClayBadge } from '../../../components/ui/ClayBadge';
import { Mail, Lock, UserPlus, LogIn, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage = ({ onNavigate, prefillEmail = '', registerSuccessMessage = '' }) => {
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: prefillEmail || '',
    password: '',
  });

  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState(registerSuccessMessage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password');
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      if (result.user.role === 'practitioner') {
        onNavigate('practitioner-dashboard');
      } else {
        onNavigate('user-dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  // Quick Demo Account Auto-Fill
  const handleQuickFill = (email, password) => {
    setFormData({ email, password });
    setError('');
    setSuccessInfo('');
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Registration Success Banner if redirected from registration */}
        {successInfo && (
          <div
            className="clay-inset"
            style={{
              padding: '14px 18px',
              borderRadius: '20px',
              backgroundColor: '#E6F0EB',
              border: '2px solid var(--forest-primary)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <CheckCircle2 size={24} color="var(--forest-primary)" />
            <div>
              <h5 style={{ color: 'var(--forest-primary)', fontWeight: 700, fontSize: '0.95rem' }}>
                Account Created Successfully!
              </h5>
              <p style={{ color: 'var(--forest-dark)', fontSize: '0.84rem' }}>
                {successInfo} You can now log in below.
              </p>
            </div>
          </div>
        )}

        {/* Main Login Clay Card */}
        <ClayCard variant="beige" style={{ padding: '36px 32px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '22px',
                background: 'linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%)',
                color: '#FFFFFF',
                boxShadow: 'var(--clay-button-forest)',
                marginBottom: '16px',
              }}
            >
              <LogIn size={26} />
            </div>

            <h1
              style={{
                fontSize: '1.9rem',
                color: 'var(--forest-primary)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '6px',
              }}
            >
              Login to continue
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              Enter your credentials to access your verified therapies portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Field 1: Email */}
            <ClayInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. practitioner@nurova.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />

            {/* Field 2: Password */}
            <ClayInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your secret password"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              required
            />

            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--burst-orange-soft)',
                  border: '1.5px solid var(--burst-orange)',
                  color: 'var(--burst-orange-dark)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <ClayButton
              type="submit"
              variant="forest"
              size="lg"
              fullWidth
              loading={loading}
              icon={LogIn}
              style={{ marginTop: '8px' }}
            >
              Login to continue
            </ClayButton>
          </form>

          {/* New User Register Notice Prompt */}
          <div
            className="clay-inset"
            style={{
              marginTop: '28px',
              padding: '18px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--sand-light)',
              borderRadius: '22px',
              border: '1.5px solid rgba(226, 208, 181, 0.8)',
            }}
          >
            <p
              style={{
                fontSize: '0.94rem',
                fontWeight: 600,
                color: 'var(--forest-primary)',
                marginBottom: '12px',
              }}
            >
              If you are new, please register
            </p>
            <ClayButton
              variant="orange"
              size="md"
              fullWidth
              onClick={() => onNavigate('register')}
              icon={UserPlus}
            >
              Create New Account & Verify
            </ClayButton>
          </div>

          {/* Quick-Fill Demo Helper */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '2px dashed rgba(188, 163, 131, 0.3)' }}>
            <p
              className="font-highlight"
              style={{
                fontSize: '0.72rem',
                textAlign: 'center',
                color: 'var(--text-light)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '10px',
              }}
            >
              ⚡ Quick Demo Logins:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('dr.ananya@nurova.com', 'password123')}
                style={{
                  background: '#F3E4D2',
                  border: '1px solid #D4BE9F',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>🌿 <strong>Dr. Ananya Roy</strong> (Verified Practitioner)</span>
                <span className="font-highlight" style={{ fontSize: '0.7rem', color: 'var(--forest-primary)' }}>AUTO-FILL</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('practitioner.pending@nurova.com', 'password123')}
                style={{
                  background: '#F3E4D2',
                  border: '1px solid #D4BE9F',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>📋 <strong>Marcus Vance</strong> (Pending Verification)</span>
                <span className="font-highlight" style={{ fontSize: '0.7rem', color: 'var(--burst-orange)' }}>AUTO-FILL</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('user@nurova.com', 'password123')}
                style={{
                  background: '#F3E4D2',
                  border: '1px solid #D4BE9F',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>👤 <strong>Aarav Sharma</strong> (Wellness Seeker)</span>
                <span className="font-highlight" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AUTO-FILL</span>
              </button>
            </div>
          </div>
        </ClayCard>
      </div>
    </div>
  );
};
