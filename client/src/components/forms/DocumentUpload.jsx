import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Trash2, Eye, AlertCircle } from 'lucide-react';
import { ClayBadge } from '../ui/ClayBadge';
import { ClayButton } from '../ui/ClayButton';

/**
 * DocumentUpload - Claymorphic File Upload and Document Verification Component
 */
export const DocumentUpload = ({
  docType,
  title,
  description,
  required = true,
  acceptedFormats = 'PDF, JPG, PNG (Max 10MB)',
  currentDoc,
  onUpload,
  onRemove,
  onPreview,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSimulatedUpload = (fileName = null) => {
    setUploading(true);
    setProgress(10);

    const targetName = fileName || `${docType.toUpperCase()}_Document_${Math.floor(Math.random() * 8999 + 1000)}.pdf`;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setUploading(false);
          onUpload({
            id: `doc_${Date.now()}`,
            type: docType,
            title: title,
            filename: targetName,
            size: `${(Math.random() * 2 + 1.2).toFixed(1)} MB`,
            uploadedAt: new Date().toISOString().split('T')[0],
            status: 'under_review',
            verifiedBy: 'Pending Verification Check',
          });
          return 0;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSimulatedUpload(file.name);
    }
  };

  return (
    <div
      className="clay-inset"
      style={{
        padding: '20px',
        marginBottom: '16px',
        background: currentDoc ? '#F9F0E5' : '#F3E4D2',
        border: currentDoc ? '1.5px solid var(--forest-light)' : '1px solid rgba(212, 190, 159, 0.6)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ color: 'var(--forest-primary)', fontSize: '1.02rem', fontWeight: 700 }}>
              {title}
            </h4>
            {required ? (
              <ClayBadge variant="orange" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                Required
              </ClayBadge>
            ) : (
              <ClayBadge variant="sand" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                Optional
              </ClayBadge>
            )}
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {description}
          </p>
        </div>

        {currentDoc && (
          <ClayBadge
            variant={
              currentDoc.status === 'approved'
                ? 'forest'
                : currentDoc.status === 'under_review'
                ? 'orange'
                : 'beige'
            }
            icon={currentDoc.status === 'approved' ? CheckCircle2 : AlertCircle}
            style={{ textTransform: 'capitalize' }}
          >
            {currentDoc.status === 'approved' ? 'Verified' : 'Under Review'}
          </ClayBadge>
        )}
      </div>

      {/* Body: Uploaded state or Dropzone state */}
      {currentDoc ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'var(--warm-beige)',
            borderRadius: '16px',
            boxShadow: '4px 6px 12px rgba(188, 163, 131, 0.3), inset 1px 1px 2px rgba(255, 255, 255, 0.7)',
            marginTop: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--forest-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 3px 6px rgba(53, 92, 69, 0.35)',
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: 'var(--text-dark)',
                  maxWidth: '280px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentDoc.filename}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {currentDoc.size} • Uploaded on {currentDoc.uploadedAt}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {onPreview && (
              <ClayButton
                variant="beige"
                size="sm"
                onClick={() => onPreview(currentDoc)}
                icon={Eye}
                title="Preview document"
              >
                Preview
              </ClayButton>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(currentDoc.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--burst-orange)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background 0.2s ease',
                }}
                title="Remove file"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      ) : uploading ? (
        <div style={{ marginTop: '12px', padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--forest-primary)', marginBottom: '8px' }}>
            Uploading and encrypting document... {progress}%
          </p>
          <div
            style={{
              height: '10px',
              width: '100%',
              background: '#E0CEB7',
              borderRadius: '999px',
              overflow: 'hidden',
              boxShadow: 'inset 2px 2px 4px rgba(180, 150, 120, 0.4)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--forest-primary) 0%, var(--burst-orange) 100%)',
                borderRadius: '999px',
                transition: 'width 0.2s ease-in-out',
              }}
            />
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleSimulatedUpload(file.name);
          }}
          style={{
            marginTop: '12px',
            border: isDragging ? '2px dashed var(--burst-orange)' : '2px dashed #D4BE9F',
            borderRadius: '18px',
            padding: '20px 16px',
            textAlign: 'center',
            backgroundColor: isDragging ? 'rgba(201, 120, 75, 0.08)' : 'rgba(255, 255, 255, 0.4)',
            transition: 'all 0.2s ease',
          }}
        >
          <UploadCloud
            size={32}
            style={{
              color: isDragging ? 'var(--burst-orange)' : 'var(--forest-primary)',
              marginBottom: '8px',
              opacity: 0.85,
            }}
          />
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)' }}>
            Drag & drop your file here, or{' '}
            <label
              htmlFor={`file-input-${docType}`}
              style={{ color: 'var(--burst-orange)', textDecoration: 'underline', cursor: 'pointer' }}
            >
              browse
            </label>
          </p>
          <input
            id={`file-input-${docType}`}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Supported formats: {acceptedFormats}
          </p>

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <ClayButton
              variant="beige"
              size="sm"
              onClick={() => handleSimulatedUpload()}
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              + Auto-Attach Sample {title.split(' ')[0]}
            </ClayButton>
          </div>
        </div>
      )}
    </div>
  );
};
