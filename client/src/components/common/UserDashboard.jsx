import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ClayCard } from '../ui/ClayCard';
import { ClayBadge } from '../ui/ClayBadge';
import { ClayButton } from '../ui/ClayButton';
import { SPECIALIZATIONS } from '../../config/constants';
import {
  Sparkles,
  ShieldCheck,
  Calendar,
  Search,
  User,
  HeartHandshake,
  Stethoscope,
} from 'lucide-react';

export const UserDashboard = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0 60px 0' }}>
      <div className="app-container">
        {/* Welcome Card */}
        <ClayCard variant="beige" style={{ marginBottom: '24px', padding: '32px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  boxShadow: 'var(--clay-button-forest)',
                }}
              >
                {(currentUser?.name || currentUser?.email || 'U').charAt(0).toUpperCase()}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ fontSize: '1.75rem', color: 'var(--forest-primary)', fontWeight: 800 }}>
                    Welcome, {currentUser?.name || 'Wellness Seeker'}!
                  </h1>
                  <ClayBadge variant="forest">Active Account</ClayBadge>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Email: <strong>{currentUser?.email}</strong> • Role: <strong>Wellness User</strong>
                </p>
              </div>
            </div>

            <div>
              <ClayButton
                variant="orange"
                size="md"
                onClick={() => onNavigate('register')}
                icon={Stethoscope}
              >
                Register as Practitioner
              </ClayButton>
            </div>
          </div>
        </ClayCard>

        {/* Explore Verified Therapy Categories */}
        <ClayCard variant="beige" style={{ padding: '28px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--forest-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
              Verified Alternative Therapy Modalities
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              All practitioners on Nurova are officially vetted and verified through Module A credentialing.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            {SPECIALIZATIONS.map((spec) => (
              <div
                key={spec.id}
                className="clay-inset"
                style={{
                  padding: '20px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--sand-light)',
                  border: '1.5px solid rgba(226, 208, 181, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🌿</span>
                    <h4 style={{ color: 'var(--forest-primary)', fontWeight: 700, fontSize: '1.05rem' }}>
                      {spec.name}
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {spec.desc}
                  </p>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <ClayBadge variant="forest" style={{ fontSize: '0.7rem' }}>
                    ✓ BOARD VERIFIED
                  </ClayBadge>

                  <span style={{ fontSize: '0.78rem', color: 'var(--burst-orange)', fontWeight: 600 }}>
                    Browse Experts →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ClayCard>
      </div>
    </div>
  );
};
