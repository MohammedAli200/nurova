import React from 'react';
import { ClayModal } from '../../../components/ui/ClayModal';
import { ClayBadge } from '../../../components/ui/ClayBadge';
import { ClayButton } from '../../../components/ui/ClayButton';
import { VERIFICATION_STATUSES } from '../../../config/constants';
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ProfilePreviewModal = ({ isOpen, onClose, practitioner }) => {
  if (!practitioner) return null;

  const isVerified = practitioner.verificationStatus === VERIFICATION_STATUSES.VERIFIED;

  return (
    <ClayModal
      isOpen={isOpen}
      onClose={onClose}
      title="Public Marketplace Card Preview"
      subtitle="This is how wellness seekers will see your practitioner card on the Nurova platform"
      maxWidth="620px"
    >
      <div
        className="clay-card-sand"
        style={{
          padding: '24px',
          borderRadius: '24px',
          border: isVerified ? '2px solid var(--forest-primary)' : '2px dashed var(--burst-orange)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '20px',
        }}
      >
        {/* Verification Status Ribbon Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1.5px solid rgba(226, 208, 181, 0.7)',
          }}
        >
          {isVerified ? (
            <ClayBadge variant="forest" icon={ShieldCheck}>
              ✓ NUROVA VERIFIED PRACTITIONER
            </ClayBadge>
          ) : (
            <ClayBadge variant="orange" icon={Clock}>
              VERIFICATION UNDER REVIEW
            </ClayBadge>
          )}

          <span className="font-highlight" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            LIC: {practitioner.licenseNumber || 'PENDING'}
          </span>
        </div>

        {/* Practitioner Header */}
        <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
          {/* Avatar Icon */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800,
              boxShadow: 'var(--clay-button-forest)',
              flexShrink: 0,
            }}
          >
            {(practitioner.name || 'P').charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--forest-primary)', fontWeight: 800 }}>
                {practitioner.name}
              </h3>
              {isVerified && (
                <span title="Verified by Medical Board">
                  <CheckCircle2 size={18} color="var(--forest-primary)" />
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--burst-orange)', fontWeight: 600, marginTop: '2px' }}>
              {practitioner.title || 'Alternative Therapy Specialist'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={14} /> {practitioner.experienceYears || 5}+ Years Experience
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} /> {practitioner.clinicName || 'Bangalore Clinic'}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginTop: '16px' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.45' }}>
            {practitioner.bio ||
              'Experienced alternative therapies clinician committed to restorative healing, customized lifestyle regimens, and evidence-supported complementary medicine.'}
          </p>
        </div>

        {/* Specialization Tags */}
        <div style={{ marginTop: '16px' }}>
          <p className="font-highlight" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Therapy Modalities:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(practitioner.specializationTags || [practitioner.specialization || 'Ayurveda']).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--warm-beige)',
                  color: 'var(--forest-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  boxShadow: '1px 2px 4px rgba(188, 163, 131, 0.3)',
                }}
              >
                🌿 {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action button preview */}
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1.5px dashed rgba(226, 208, 181, 0.7)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Initial Consultation</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--forest-primary)' }}>
              $65.00 <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ 45 min</span>
            </p>
          </div>

          <ClayButton
            variant={isVerified ? 'forest' : 'orange'}
            size="sm"
            disabled={!isVerified}
            icon={Calendar}
          >
            {isVerified ? 'Book Therapy Session' : 'Pending Verification'}
          </ClayButton>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ClayButton variant="beige" onClick={onClose}>
          Close Preview
        </ClayButton>
      </div>
    </ClayModal>
  );
};
