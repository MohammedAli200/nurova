import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ClayBadge } from '../ui/ClayBadge';
import { ClayButton } from '../ui/ClayButton';
import { ROLES, VERIFICATION_STATUSES } from '../../config/constants';
import { Sparkles, ShieldCheck, User, LogOut, HeartHandshake, CheckCircle2, Clock } from 'lucide-react';

export const Navbar = ({ currentView, onNavigate }) => {
  const { currentUser, isAuthenticated, logout, updatePractitionerStatus } = useAuth();

  const isPractitioner = currentUser?.role === ROLES.PRACTITIONER;

  return (
    <header
      style={{
        width: '100%',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(248, 235, 221, 0.85)',
        borderBottom: '1.5px solid rgba(226, 208, 181, 0.6)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate(isAuthenticated ? (isPractitioner ? 'practitioner-dashboard' : 'user-dashboard') : 'login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            className="clay-btn-forest"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '4px 6px 14px rgba(53, 92, 69, 0.4)',
            }}
          >
            <Sparkles size={22} color="#FFF7EE" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--forest-primary)',
                  letterSpacing: '-0.03em',
                  fontFamily: 'var(--font-primary)',
                }}
              >
                NUROVA
              </span>
              <span
                className="font-highlight"
                style={{
                  fontSize: '0.68rem',
                  background: 'var(--burst-orange)',
                  color: '#FFFFFF',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                MOD A
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '-2px' }}>
              Wellness Marketplace • Alternative Therapies
            </p>
          </div>
        </div>

        {/* Right Nav State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <>
              {/* Role & Verification Badge */}
              {isPractitioner ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ClayBadge
                    variant={
                      currentUser.verificationStatus === VERIFICATION_STATUSES.VERIFIED
                        ? 'forest'
                        : 'orange'
                    }
                    icon={
                      currentUser.verificationStatus === VERIFICATION_STATUSES.VERIFIED
                        ? CheckCircle2
                        : Clock
                    }
                  >
                    {currentUser.verificationStatus === VERIFICATION_STATUSES.VERIFIED
                      ? 'Verified Practitioner'
                      : 'Verification In Review'}
                  </ClayBadge>
                </div>
              ) : (
                <ClayBadge variant="sand" icon={User}>
                  Wellness Seeker
                </ClayBadge>
              )}

              {/* User Pill */}
              <div
                className="clay-inset"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '16px',
                  background: 'var(--warm-beige)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isPractitioner ? 'var(--forest-primary)' : 'var(--burst-orange)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                  {currentUser.name || currentUser.email.split('@')[0]}
                </span>
              </div>

              {/* Logout Button */}
              <ClayButton
                variant="beige"
                size="sm"
                onClick={() => {
                  logout();
                  onNavigate('login');
                }}
                icon={LogOut}
                title="Logout"
              >
                Sign Out
              </ClayButton>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ClayButton
                variant={currentView === 'login' ? 'forest' : 'beige'}
                size="sm"
                onClick={() => onNavigate('login')}
              >
                Login
              </ClayButton>
              <ClayButton
                variant={currentView === 'register' ? 'orange' : 'beige'}
                size="sm"
                onClick={() => onNavigate('register')}
              >
                Register
              </ClayButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
