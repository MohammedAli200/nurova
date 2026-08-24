import React from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { ClayBadge } from '../../../components/ui/ClayBadge';
import { VERIFICATION_STAGES, VERIFICATION_STATUSES } from '../../../config/constants';
import { CheckCircle2, Clock, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export const VerificationTimeline = ({ currentStatus, progressPercent }) => {
  const getStageState = (stageNumber) => {
    if (currentStatus === VERIFICATION_STATUSES.VERIFIED) {
      return 'completed';
    }

    if (currentStatus === VERIFICATION_STATUSES.UNDER_REVIEW) {
      if (stageNumber <= 2) return 'completed';
      if (stageNumber === 3) return 'in_progress';
      return 'pending';
    }

    if (currentStatus === VERIFICATION_STATUSES.PENDING) {
      if (stageNumber === 1) return 'completed';
      if (stageNumber === 2) return 'in_progress';
      return 'pending';
    }

    if (currentStatus === VERIFICATION_STATUSES.ACTION_REQUIRED) {
      if (stageNumber === 1) return 'completed';
      if (stageNumber === 2) return 'action_needed';
      return 'pending';
    }

    return 'pending';
  };

  return (
    <ClayCard variant="beige" style={{ marginBottom: '24px', padding: '28px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ color: 'var(--forest-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
              Verification Lifecycle Tracker
            </h3>
            <ClayBadge
              variant={currentStatus === VERIFICATION_STATUSES.VERIFIED ? 'forest' : 'orange'}
              icon={currentStatus === VERIFICATION_STATUSES.VERIFIED ? CheckCircle2 : Clock}
            >
              {currentStatus.replace('_', ' ').toUpperCase()}
            </ClayBadge>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Nurova credentialing and alternative therapies clinical board assessment
          </p>
        </div>

        {/* Progress % */}
        <div style={{ textAlign: 'right' }}>
          <span
            className="font-highlight"
            style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--forest-primary)' }}
          >
            {progressPercent}%
          </span>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            ONBOARDING COMPLETION
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: '12px',
          width: '100%',
          background: '#E2D0B5',
          borderRadius: '999px',
          overflow: 'hidden',
          boxShadow: 'inset 2px 2px 5px rgba(188, 163, 131, 0.45)',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background:
              currentStatus === VERIFICATION_STATUSES.VERIFIED
                ? 'linear-gradient(90deg, #4A7A5D 0%, #355C45 100%)'
                : 'linear-gradient(90deg, #355C45 0%, #C9784B 100%)',
            borderRadius: '999px',
            transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </div>

      {/* Timeline Steps Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {VERIFICATION_STAGES.map((stage) => {
          const state = getStageState(stage.stage);

          let nodeBg = 'var(--sand-light)';
          let nodeColor = 'var(--text-muted)';
          let nodeBorder = '1px solid #D4BE9F';
          let icon = <span className="font-highlight">{stage.stage}</span>;

          if (state === 'completed') {
            nodeBg = 'var(--forest-primary)';
            nodeColor = '#FFFFFF';
            nodeBorder = 'none';
            icon = <CheckCircle2 size={18} />;
          } else if (state === 'in_progress') {
            nodeBg = 'var(--burst-orange)';
            nodeColor = '#FFFFFF';
            nodeBorder = 'none';
            icon = <Clock size={18} className="animate-spin" />;
          } else if (state === 'action_needed') {
            nodeBg = '#D9534F';
            nodeColor = '#FFFFFF';
            nodeBorder = 'none';
            icon = <AlertCircle size={18} />;
          }

          return (
            <div
              key={stage.id}
              className="clay-inset"
              style={{
                padding: '16px',
                background: state === 'completed' ? '#F2F8F4' : '#F7ECE0',
                border:
                  state === 'completed'
                    ? '1.5px solid var(--forest-light)'
                    : state === 'in_progress'
                    ? '1.5px solid var(--burst-orange)'
                    : '1px solid rgba(212, 190, 159, 0.6)',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: nodeBg,
                      color: nodeColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      boxShadow: '2px 3px 6px rgba(188, 163, 131, 0.3)',
                    }}
                  >
                    {icon}
                  </div>
                  <span
                    className="font-highlight"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: state === 'completed' ? 'var(--forest-primary)' : 'var(--burst-orange)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {state.replace('_', ' ')}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--forest-primary)', marginBottom: '4px' }}>
                  {stage.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {stage.desc}
                </p>
              </div>

              {stage.stage === 4 && currentStatus === VERIFICATION_STATUSES.VERIFIED && (
                <div style={{ marginTop: '12px' }}>
                  <ClayBadge variant="forest" icon={Sparkles} style={{ width: '100%', justifyContent: 'center' }}>
                    BADGE ACTIVE
                  </ClayBadge>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ClayCard>
  );
};
