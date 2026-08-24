import React, { useState } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { ClayBadge } from '../../../components/ui/ClayBadge';
import { ClayButton } from '../../../components/ui/ClayButton';
import { SPECIALIZATIONS } from '../../../config/constants';
import { Tag, Plus, Check } from 'lucide-react';

const POPULAR_MODALITIES = [
  'Ayurveda',
  'Panchakarma',
  'Physiotherapy',
  'Spine Rehabilitation',
  'Acupuncture',
  'Cupping Therapy',
  'Chiropractic Care',
  'Joint Mobilization',
  'Naturopathy',
  'Herbal Remedies',
  'Yoga & Pranayama',
  'Mindfulness Meditation',
  'Dry Needling',
];

export const SpecializationTags = ({ activeTags = [], onUpdateTags }) => {
  const [customTag, setCustomTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const toggleTag = (tagName) => {
    if (activeTags.includes(tagName)) {
      onUpdateTags(activeTags.filter((t) => t !== tagName));
    } else {
      onUpdateTags([...activeTags, tagName]);
    }
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (customTag.trim() && !activeTags.includes(customTag.trim())) {
      onUpdateTags([...activeTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  return (
    <ClayCard variant="beige" style={{ marginBottom: '24px', padding: '28px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ color: 'var(--forest-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
              Specialization & Therapy Modalities
            </h3>
            <ClayBadge variant="forest">{activeTags.length} Active Modalities</ClayBadge>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Tag the alternative modalities you offer. Verified modalities appear on your marketplace profile.
          </p>
        </div>

        <ClayButton
          variant="beige"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Done Editing' : 'Customize Modalities'}
        </ClayButton>
      </div>

      {/* Active Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {activeTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => isEditing && toggleTag(tag)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '16px',
              backgroundColor: 'var(--forest-primary)',
              color: '#FFFFFF',
              border: 'none',
              boxShadow: '3px 4px 8px rgba(53, 92, 69, 0.35)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: isEditing ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🌿</span>
            <span>{tag}</span>
            {isEditing && <span style={{ opacity: 0.7, marginLeft: '4px' }}>✕</span>}
          </button>
        ))}
      </div>

      {/* Editing suggestions cloud */}
      {isEditing && (
        <div
          className="clay-inset"
          style={{
            padding: '18px',
            backgroundColor: 'var(--sand-light)',
            borderRadius: '20px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <p
            className="font-highlight"
            style={{
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px',
              fontWeight: 700,
            }}
          >
            Click to add / remove popular therapies:
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {POPULAR_MODALITIES.map((modality) => {
              const isSelected = activeTags.includes(modality);
              return (
                <button
                  key={modality}
                  type="button"
                  onClick={() => toggleTag(modality)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '14px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid #D4BE9F',
                    backgroundColor: isSelected ? 'var(--forest-soft)' : '#FFFFFF',
                    color: isSelected ? 'var(--forest-primary)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isSelected && <Check size={14} color="var(--forest-primary)" />}
                  {modality}
                </button>
              );
            })}
          </div>

          {/* Add custom tag */}
          <form onSubmit={handleAddCustomTag} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Add specialized therapy (e.g. CranioSacral, Marma Therapy)..."
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '14px',
                border: '1px solid #D4BE9F',
                background: '#FFFFFF',
                fontSize: '0.88rem',
              }}
            />
            <ClayButton variant="forest" size="sm" type="submit" icon={Plus}>
              Add Modality
            </ClayButton>
          </form>
        </div>
      )}
    </ClayCard>
  );
};
