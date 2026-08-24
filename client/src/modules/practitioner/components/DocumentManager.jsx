import React, { useState } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { ClayBadge } from '../../../components/ui/ClayBadge';
import { ClayButton } from '../../../components/ui/ClayButton';
import { ClayModal } from '../../../components/ui/ClayModal';
import { DocumentUpload } from '../../../components/forms/DocumentUpload';
import { REQUIRED_DOCUMENTS } from '../../../config/constants';
import {
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Download,
} from 'lucide-react';

export const DocumentManager = ({ documents = [], onAddDocument, onRemoveDocument }) => {
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedUploadType, setSelectedUploadType] = useState('additional_cert');

  const getDocStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <ClayBadge variant="forest" icon={CheckCircle2}>
            Verified
          </ClayBadge>
        );
      case 'under_review':
        return (
          <ClayBadge variant="orange" icon={Clock}>
            Under Review
          </ClayBadge>
        );
      case 'action_required':
        return (
          <ClayBadge variant="sand" icon={AlertCircle}>
            Action Required
          </ClayBadge>
        );
      default:
        return <ClayBadge variant="sand">Uploaded</ClayBadge>;
    }
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
              Credential & Document Repository
            </h3>
            <ClayBadge variant="beige">
              {documents.length} Submitted Documents
            </ClayBadge>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Official licensing, identity proofs, and clinical certificates submitted for verification
          </p>
        </div>

        <ClayButton
          variant="forest"
          size="sm"
          onClick={() => setShowUploadModal(true)}
          icon={Plus}
        >
          Upload Additional Certificate
        </ClayButton>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div
          className="clay-inset"
          style={{
            padding: '30px',
            textAlign: 'center',
            backgroundColor: 'var(--sand-light)',
            borderRadius: '20px',
          }}
        >
          <FileText size={36} color="var(--burst-orange)" style={{ marginBottom: '8px' }} />
          <p style={{ fontWeight: 600, color: 'var(--forest-primary)' }}>
            No documents uploaded yet.
          </p>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Upload your medical practice license and ID proof to begin verification.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="clay-inset"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: '#FAF2E9',
                borderRadius: '18px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    background: doc.status === 'approved' ? 'var(--forest-primary)' : 'var(--warm-beige-dark)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '2px 3px 6px rgba(188, 163, 131, 0.3)',
                  }}
                >
                  <FileText size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--forest-primary)' }}>
                      {doc.title || doc.filename}
                    </h4>
                    {getDocStatusBadge(doc.status)}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    File: <code className="font-highlight">{doc.filename}</code> • {doc.size || '1.8 MB'} • Uploaded: {doc.uploadedAt || '2026-08-20'}
                  </p>
                  {doc.verifiedBy && (
                    <p style={{ fontSize: '0.74rem', color: 'var(--forest-light)', fontWeight: 600, marginTop: '2px' }}>
                      ✓ Assessed by: {doc.verifiedBy}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <ClayButton
                  variant="beige"
                  size="sm"
                  onClick={() => setPreviewDoc(doc)}
                  icon={Eye}
                >
                  View Preview
                </ClayButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Preview Modal */}
      <ClayModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.title || 'Document Credential'}
        subtitle={`Filename: ${previewDoc?.filename}`}
        maxWidth="600px"
      >
        <div
          className="clay-inset"
          style={{
            padding: '30px',
            backgroundColor: 'var(--sand-light)',
            borderRadius: '24px',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'var(--forest-primary)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: 'var(--clay-button-forest)',
            }}
          >
            <FileCheck size={32} />
          </div>

          <h3 style={{ color: 'var(--forest-primary)', fontSize: '1.2rem', fontWeight: 800 }}>
            {previewDoc?.filename}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '4px' }}>
            Encrypted Document SHA-256 Verified • Status: {previewDoc?.status?.toUpperCase()}
          </p>

          <div
            style={{
              margin: '20px auto 0 auto',
              maxWidth: '380px',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: 'inset 2px 2px 4px rgba(188, 163, 131, 0.3)',
              textAlign: 'left',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Document Type:</span>
              <strong style={{ color: 'var(--forest-primary)' }}>{previewDoc?.type || 'License'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>File Size:</span>
              <strong>{previewDoc?.size || '2.1 MB'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Verification Authority:</span>
              <strong>{previewDoc?.verifiedBy || 'Medical Council'}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <ClayButton variant="beige" onClick={() => setPreviewDoc(null)}>
            Close
          </ClayButton>
        </div>
      </ClayModal>

      {/* Upload Additional Modal */}
      <ClayModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Additional Certification"
        subtitle="Add continuing education certificates, specialized modality licenses or accreditations"
      >
        <DocumentUpload
          docType="additional_certification"
          title="Clinical Specialization Certificate"
          description="E.g. Advanced Acupuncture, Panchakarma Mastery, or Chiropractic Board Cert"
          required={false}
          onUpload={(docObj) => {
            onAddDocument(docObj);
            setShowUploadModal(false);
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ClayButton variant="beige" onClick={() => setShowUploadModal(false)}>
            Cancel
          </ClayButton>
        </div>
      </ClayModal>
    </ClayCard>
  );
};
