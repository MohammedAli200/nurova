import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { ClayCard } from '../../../components/ui/ClayCard';
import { ClayButton } from '../../../components/ui/ClayButton';
import { ClayInput } from '../../../components/ui/ClayInput';
import { ClayBadge } from '../../../components/ui/ClayBadge';
import { ClayModal } from '../../../components/ui/ClayModal';
import { DocumentUpload } from '../../../components/forms/DocumentUpload';
import { ROLES, SPECIALIZATIONS, REQUIRED_DOCUMENTS } from '../../../config/constants';
import {
  Mail,
  Lock,
  User,
  Stethoscope,
  ShieldCheck,
  Award,
  ArrowLeft,
  FileCheck,
  Building,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const RegisterPage = ({ onNavigate, onRegistrationComplete }) => {
  const { register, loading } = useAuth();

  // 3 Primary Fields: email, password, and roles
  const [selectedRole, setSelectedRole] = useState(ROLES.USER); // 'user' or 'practitioner'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Additional Practitioner Fields (when role === practitioner)
  const [practitionerDetails, setPractitionerDetails] = useState({
    name: '',
    title: '',
    specialization: 'ayurveda',
    licenseNumber: '',
    experienceYears: '5',
    clinicName: '',
    bio: '',
  });

  // Uploaded Documents state for Practitioner
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [error, setError] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePractitionerFieldChange = (e) => {
    const { name, value } = e.target;
    setPractitionerDetails((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleDocumentUpload = (docType, docObject) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docType]: docObject,
    }));
    setError('');
  };

  const handleDocumentRemove = (docType) => {
    setUploadedDocs((prev) => {
      const copy = { ...prev };
      delete copy[docType];
      return copy;
    });
  };

  // Quick Auto-Attach All Required Documents for testing
  const handleAutoAttachAllDocs = () => {
    const mockAttached = {};
    REQUIRED_DOCUMENTS.forEach((doc) => {
      mockAttached[doc.id] = {
        id: `doc_${doc.id}_${Date.now()}`,
        type: doc.id,
        title: doc.title,
        filename: doc.example,
        size: '2.4 MB',
        uploadedAt: new Date().toISOString().split('T')[0],
        status: 'under_review',
        verifiedBy: 'Pending Verification Check',
      };
    });
    setUploadedDocs(mockAttached);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (selectedRole === ROLES.USER) {
      // User Registration Flow
      const regData = {
        email: email.trim(),
        password: password,
        role: ROLES.USER,
        name: email.split('@')[0],
      };

      const res = await register(regData);
      if (res.success) {
        if (onRegistrationComplete) {
          onRegistrationComplete({
            email: email.trim(),
            message: 'User account created successfully!',
          });
        } else {
          onNavigate('login');
        }
      } else {
        setError(res.error);
      }
    } else {
      // Practitioner Registration Flow
      if (!practitionerDetails.name.trim()) {
        setError('Please enter your full practitioner name');
        return;
      }
      if (!practitionerDetails.licenseNumber.trim()) {
        setError('Please enter your practice license / registration number');
        return;
      }

      // Check required documents
      const missingRequired = REQUIRED_DOCUMENTS.filter(
        (req) => req.required && !uploadedDocs[req.id]
      );

      if (missingRequired.length > 0) {
        setError(
          `Please upload all required verification documents: ${missingRequired
            .map((m) => m.title)
            .join(', ')}`
        );
        return;
      }

      const docsArray = Object.values(uploadedDocs);

      const regData = {
        email: email.trim(),
        password: password,
        role: ROLES.PRACTITIONER,
        name: practitionerDetails.name,
        title:
          practitionerDetails.title ||
          `Specialist in ${practitionerDetails.specialization.toUpperCase()}`,
        specialization: practitionerDetails.specialization,
        specializationTags: [
          practitionerDetails.specialization.charAt(0).toUpperCase() +
            practitionerDetails.specialization.slice(1),
          'Holistic Therapy',
        ],
        licenseNumber: practitionerDetails.licenseNumber,
        experienceYears: practitionerDetails.experienceYears,
        clinicName: practitionerDetails.clinicName || 'Alternative Care Clinic',
        bio: practitionerDetails.bio,
        documents: docsArray,
      };

      const res = await register(regData);
      if (res.success) {
        setShowSuccessModal(true);
      } else {
        setError(res.error);
      }
    }
  };

  const handleModalCloseAndRedirect = () => {
    setShowSuccessModal(false);
    if (onRegistrationComplete) {
      onRegistrationComplete({
        email: email.trim(),
        message: 'Practitioner application & documents submitted for verification!',
      });
    } else {
      onNavigate('login');
    }
  };

  const requiredUploadedCount = REQUIRED_DOCUMENTS.filter(
    (d) => d.required && uploadedDocs[d.id]
  ).length;
  const totalRequiredCount = REQUIRED_DOCUMENTS.filter((d) => d.required).length;

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '28px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: selectedRole === ROLES.PRACTITIONER ? '720px' : '480px' }}>
        {/* Back to Login Button */}
        <div style={{ marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--forest-primary)',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            <ArrowLeft size={18} />
            Back to Login
          </button>
        </div>

        {/* Register Clay Card */}
        <ClayCard variant="beige" style={{ padding: '36px 32px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1
              style={{
                fontSize: '1.9rem',
                color: 'var(--forest-primary)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '6px',
              }}
            >
              Create Your Account
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              Select your role and enter credentials to join the alternative wellness platform
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Field 3: ROLES (Role selector) */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--text-dark)',
                }}
              >
                Select Account Role <span style={{ color: 'var(--burst-orange)' }}>*</span>
              </label>

              <div className="clay-segment-wrapper">
                {/* Role 1: User */}
                <button
                  type="button"
                  className={`clay-segment-item ${selectedRole === ROLES.USER ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedRole(ROLES.USER);
                    setError('');
                  }}
                >
                  <User size={18} />
                  <span>User / Seeker</span>
                </button>

                {/* Role 2: Practitioner */}
                <button
                  type="button"
                  className={`clay-segment-item ${selectedRole === ROLES.PRACTITIONER ? 'active-orange' : ''}`}
                  onClick={() => {
                    setSelectedRole(ROLES.PRACTITIONER);
                    setError('');
                  }}
                >
                  <Stethoscope size={18} />
                  <span>Practitioner (Onboarding)</span>
                </button>
              </div>

              {/* Role explanation subtitle badge */}
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {selectedRole === ROLES.USER
                    ? '👉 Access verified therapy providers, book sessions, and buy remedies.'
                    : '👉 Complete credential verification and offer verified alternative therapies.'}
                </span>
              </div>
            </div>

            {/* Field 1: Email */}
            <ClayInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. yourname@domain.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              icon={Mail}
              required
            />

            {/* Field 2: Password */}
            <ClayInput
              label="Password"
              name="password"
              type="password"
              placeholder="Create a strong password (min 6 chars)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              icon={Lock}
              required
            />

            {/* ========================================================
                PRACTITIONER ONBOARDING & DOCUMENT VERIFICATION SECTION
                (Shown when Practitioner role is selected)
               ======================================================== */}
            {selectedRole === ROLES.PRACTITIONER && (
              <div
                className="animate-fade-in"
                style={{
                  marginTop: '28px',
                  paddingTop: '24px',
                  borderTop: '2px dashed rgba(188, 163, 131, 0.4)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={22} color="var(--burst-orange)" />
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-primary)', fontWeight: 700 }}>
                      Practitioner Credentials & Verification
                    </h3>
                  </div>

                  <ClayBadge variant={requiredUploadedCount === totalRequiredCount ? 'forest' : 'orange'}>
                    {requiredUploadedCount} of {totalRequiredCount} Docs Uploaded
                  </ClayBadge>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Please submit your practice credentials and mandatory verification documents to proceed.
                </p>

                {/* Practitioner Info Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <ClayInput
                    label="Full Name (with Title)"
                    name="name"
                    placeholder="e.g. Dr. Maya Sharma, BAMS"
                    value={practitionerDetails.name}
                    onChange={handlePractitionerFieldChange}
                    icon={User}
                    required
                  />

                  <ClayInput
                    label="Primary Specialization"
                    name="specialization"
                    type="select"
                    value={practitionerDetails.specialization}
                    onChange={handlePractitionerFieldChange}
                    options={SPECIALIZATIONS.map((s) => ({ value: s.id, label: s.name }))}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <ClayInput
                    label="Medical / Practice License #"
                    name="licenseNumber"
                    placeholder="e.g. AYUR-LIC-2026-908"
                    value={practitionerDetails.licenseNumber}
                    onChange={handlePractitionerFieldChange}
                    icon={Award}
                    required
                  />

                  <ClayInput
                    label="Years of Experience"
                    name="experienceYears"
                    type="number"
                    min="1"
                    max="50"
                    placeholder="5"
                    value={practitionerDetails.experienceYears}
                    onChange={handlePractitionerFieldChange}
                    required
                  />
                </div>

                <ClayInput
                  label="Clinic / Hospital / Practice Affiliation"
                  name="clinicName"
                  placeholder="e.g. Nurova Holistic Wellness Clinic"
                  value={practitionerDetails.clinicName}
                  onChange={handlePractitionerFieldChange}
                  icon={Building}
                />

                {/* Verification Documents Upload Section */}
                <div style={{ marginTop: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                    }}
                  >
                    <h4 style={{ color: 'var(--forest-primary)', fontSize: '1.05rem', fontWeight: 700 }}>
                      Required Verification Documents
                    </h4>

                    <button
                      type="button"
                      onClick={handleAutoAttachAllDocs}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--burst-orange)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      ⚡ Quick Attach All Demo Docs
                    </button>
                  </div>

                  {REQUIRED_DOCUMENTS.map((doc) => (
                    <DocumentUpload
                      key={doc.id}
                      docType={doc.id}
                      title={doc.title}
                      description={doc.description}
                      required={doc.required}
                      acceptedFormats={doc.acceptedFormats}
                      currentDoc={uploadedDocs[doc.id]}
                      onUpload={(docObj) => handleDocumentUpload(doc.id, docObj)}
                      onRemove={() => handleDocumentRemove(doc.id)}
                      onPreview={(docObj) => setPreviewDoc(docObj)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--burst-orange-soft)',
                  border: '1.5px solid var(--burst-orange)',
                  color: 'var(--burst-orange-dark)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  margin: '18px 0',
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
            <div style={{ marginTop: '24px' }}>
              <ClayButton
                type="submit"
                variant={selectedRole === ROLES.PRACTITIONER ? 'orange' : 'forest'}
                size="lg"
                fullWidth
                loading={loading}
                icon={selectedRole === ROLES.PRACTITIONER ? FileCheck : User}
              >
                {selectedRole === ROLES.PRACTITIONER
                  ? 'Register & Submit for Verification'
                  : 'Register Account & Continue'}
              </ClayButton>
            </div>
          </form>

          {/* Already have an account? */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--forest-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Login here
              </button>
            </p>
          </div>
        </ClayCard>
      </div>

      {/* Document Preview Modal */}
      <ClayModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.title || 'Document Preview'}
        subtitle={`Filename: ${previewDoc?.filename}`}
      >
        <div
          className="clay-inset"
          style={{
            padding: '30px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--sand-light)',
            borderRadius: '20px',
            marginBottom: '20px',
          }}
        >
          <FileCheck size={48} color="var(--forest-primary)" style={{ marginBottom: '12px' }} />
          <h4 style={{ color: 'var(--forest-primary)', fontWeight: 700, marginBottom: '6px' }}>
            {previewDoc?.filename}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Document Size: {previewDoc?.size} • Encrypted & Stored
          </p>
          <div style={{ marginTop: '16px' }}>
            <ClayBadge variant="forest">VERIFICATION READY</ClayBadge>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ClayButton variant="beige" onClick={() => setPreviewDoc(null)}>
            Close Preview
          </ClayButton>
        </div>
      </ClayModal>

      {/* Practitioner Verification Submission Success Modal */}
      <ClayModal
        isOpen={showSuccessModal}
        onClose={handleModalCloseAndRedirect}
        title="Verification Documents Submitted!"
        subtitle="Your practitioner application is now under review by the Nurova Medical Board"
        maxWidth="500px"
      >
        <div style={{ textAlign: 'center', padding: '10px 0 20px 0' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--clay-button-forest)',
              marginBottom: '16px',
            }}
          >
            <CheckCircle2 size={38} />
          </div>

          <h3 style={{ color: 'var(--forest-primary)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
            Application Registered Successfully
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
            Your credentials and {Object.keys(uploadedDocs).length} verification documents have been securely uploaded. You will now be redirected to the <strong>Login Page</strong> where you can log in and monitor your verification progress!
          </p>

          <ClayButton
            variant="forest"
            size="lg"
            fullWidth
            onClick={handleModalCloseAndRedirect}
          >
            Proceed to Login Page
          </ClayButton>
        </div>
      </ClayModal>
    </div>
  );
};
