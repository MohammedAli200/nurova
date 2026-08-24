import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { ClayCard } from '../../../components/ui/ClayCard';
import { ClayBadge } from '../../../components/ui/ClayBadge';
import { ClayButton } from '../../../components/ui/ClayButton';
import { VerificationTimeline } from '../components/VerificationTimeline';
import { DocumentManager } from '../components/DocumentManager';
import { SpecializationTags } from '../components/SpecializationTags';
import { ProfilePreviewModal } from '../components/ProfilePreviewModal';
import { VERIFICATION_STATUSES } from '../../../config/constants';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  Eye,
  Building,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';

export const OnboardingVerificationPage = () => {
  const {
    currentUser,
    updatePractitionerStatus,
    addPractitionerDocument,
    removePractitionerDocument,
    updateSpecializationTags,
  } = useAuth();

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  if (!currentUser) return null;

  const isVerified = currentUser.verificationStatus === VERIFICATION_STATUSES.VERIFIED;

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0 60px 0' }}>
      <div className="app-container">
        {/* Verification Status Simulator Bar (Evaluator & Demo Helper) */}
        <div
          className="clay-inset"
          style={{
            padding: '14px 20px',
            borderRadius: '20px',
            backgroundColor: '#F3E4D2',
            border: '1.5px solid rgba(201, 120, 75, 0.4)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SlidersHorizontal size={18} color="var(--burst-orange)" />
            <span
              className="font-highlight"
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--burst-orange)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Interactive Verification Simulator (Module A):
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => updatePractitionerStatus(VERIFICATION_STATUSES.PENDING)}
              style={{
                padding: '6px 12px',
                borderRadius: '12px',
                border: '1px solid #D4BE9F',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                background:
                  currentUser.verificationStatus === VERIFICATION_STATUSES.PENDING
                    ? 'var(--forest-primary)'
                    : '#FFFFFF',
                color:
                  currentUser.verificationStatus === VERIFICATION_STATUSES.PENDING
                    ? '#FFFFFF'
                    : 'var(--text-dark)',
              }}
            >
              1. Pending
            </button>

            <button
              type="button"
              onClick={() => updatePractitionerStatus(VERIFICATION_STATUSES.UNDER_REVIEW)}
              style={{
                padding: '6px 12px',
                borderRadius: '12px',
                border: '1px solid #D4BE9F',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                background:
                  currentUser.verificationStatus === VERIFICATION_STATUSES.UNDER_REVIEW
                    ? 'var(--burst-orange)'
                    : '#FFFFFF',
                color:
                  currentUser.verificationStatus === VERIFICATION_STATUSES.UNDER_REVIEW
                    ? '#FFFFFF'
                    : 'var(--text-dark)',
              }}
            >
              2. Under Review
            </button>

            <button
              type="button"
              onClick={() => updatePractitionerStatus(VERIFICATION_STATUSES.VERIFIED)}
              style={{
                padding: '6px 12px',
                borderRadius: '12px',
                border: '1px solid #D4BE9F',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                background:
                  currentUser.verificationStatus === VERIFICATION_STATUSES.VERIFIED
                    ? 'var(--forest-primary)'
                    : '#FFFFFF',
                color:
                  currentUser.verificationStatus === VERIFICATION_STATUSES.VERIFIED
                    ? '#FFFFFF'
                    : 'var(--text-dark)',
              }}
            >
              3. Approve & Verify ✓
            </button>
          </div>
        </div>

        {/* Practitioner Hero Profile Clay Card */}
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
              {/* Avatar Icon */}
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '26px',
                  background: 'linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 800,
                  boxShadow: 'var(--clay-button-forest)',
                }}
              >
                {(currentUser.name || 'P').charAt(0)}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ fontSize: '1.75rem', color: 'var(--forest-primary)', fontWeight: 800 }}>
                    {currentUser.name || 'Practitioner Portal'}
                  </h1>

                  <ClayBadge
                    variant={isVerified ? 'forest' : 'orange'}
                    icon={isVerified ? ShieldCheck : Clock}
                  >
                    {isVerified ? 'Verified Practitioner' : 'Verification Under Review'}
                  </ClayBadge>
                </div>

                <p style={{ fontSize: '0.94rem', color: 'var(--burst-orange)', fontWeight: 600, marginTop: '2px' }}>
                  {currentUser.title || 'Alternative Medicine & Holistic Therapy Specialist'}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '0.84rem',
                    color: 'var(--text-muted)',
                    marginTop: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Award size={15} /> License: <strong className="font-highlight">{currentUser.licenseNumber || 'AYUR-84920'}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building size={15} /> {currentUser.clinicName || 'Alternative Care Clinic'}
                  </span>
                  <span>
                    Experience: <strong>{currentUser.experienceYears || 5}+ Years</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <ClayButton
                variant={isVerified ? 'forest' : 'orange'}
                size="md"
                onClick={() => setShowPreviewModal(true)}
                icon={Eye}
              >
                Marketplace Preview
              </ClayButton>
            </div>
          </div>
        </ClayCard>

        {/* 1. Verification Lifecycle Timeline */}
        <VerificationTimeline
          currentStatus={currentUser.verificationStatus || VERIFICATION_STATUSES.UNDER_REVIEW}
          progressPercent={currentUser.verificationProgress || 60}
        />

        {/* 2. Document Repository Hub */}
        <DocumentManager
          documents={currentUser.documents || []}
          onAddDocument={addPractitionerDocument}
          onRemoveDocument={removePractitionerDocument}
        />

        {/* 3. Specialization & Modalities Tagging */}
        <SpecializationTags
          activeTags={currentUser.specializationTags || ['Ayurveda', 'Physiotherapy']}
          onUpdateTags={updateSpecializationTags}
        />

        {/* Public Profile Preview Modal */}
        <ProfilePreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          practitioner={currentUser}
        />
      </div>
    </div>
  );
};
