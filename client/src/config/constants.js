/**
 * Application Constants for Nurova Wellness Marketplace
 */

export const ROLES = {
  USER: 'user',
  PRACTITIONER: 'practitioner',
  ADMIN: 'admin',
};

export const VERIFICATION_STATUSES = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  VERIFIED: 'verified',
  ACTION_REQUIRED: 'action_required',
};

export const SPECIALIZATIONS = [
  { id: 'physiotherapy', name: 'Physiotherapy', icon: 'Activity', desc: 'Musculoskeletal rehabilitation, posture & pain relief' },
  { id: 'ayurveda', name: 'Ayurveda', icon: 'Leaf', desc: 'Holistic constitutional balancing & herbal therapies' },
  { id: 'acupuncture', name: 'Acupuncture', icon: 'Sparkles', desc: 'Traditional meridian needle stimulation & energy balance' },
  { id: 'chiropractic', name: 'Chiropractic Care', icon: 'Bone', desc: 'Spine alignment, nervous system & joint mobilization' },
  { id: 'naturopathy', name: 'Naturopathy', icon: 'Sun', desc: 'Natural botanical healing & nutritional wellness' },
  { id: 'yoga_therapy', name: 'Yoga & Pranayama', icon: 'Heart', desc: 'Mind-body movement, breathwork & restorative flow' },
];

export const REQUIRED_DOCUMENTS = [
  {
    id: 'license',
    title: 'Medical / Practice License',
    description: 'Valid national/state practitioner license or board registration certificate',
    required: true,
    acceptedFormats: 'PDF, JPG, PNG (Max 10MB)',
    example: 'State_Medical_Council_License_2025.pdf'
  },
  {
    id: 'identity',
    title: 'Government Identity Proof',
    description: 'Passport, National Identity Card, or Official Driver License',
    required: true,
    acceptedFormats: 'PDF, JPG, PNG (Max 5MB)',
    example: 'Govt_ID_Passport_Front_Back.pdf'
  },
  {
    id: 'degree',
    title: 'Degree & Certification of Qualification',
    description: 'Degree diploma in Physiotherapy, BAMS, Chiropractic or Accredited Certification',
    required: true,
    acceptedFormats: 'PDF, JPG, PNG (Max 10MB)',
    example: 'Ayurvedic_Medicine_BAMS_Degree.pdf'
  },
  {
    id: 'accreditation',
    title: 'Clinic Affiliation / Practice Address Proof',
    description: 'Registered clinic establishment certificate or official letterhead proof',
    required: false,
    acceptedFormats: 'PDF, JPG, PNG (Max 5MB)',
    example: 'Wellness_Clinic_Registration_Proof.pdf'
  }
];

export const VERIFICATION_STAGES = [
  {
    stage: 1,
    id: 'submission',
    title: 'Application & Docs Submitted',
    desc: 'Basic info and medical credentials uploaded'
  },
  {
    stage: 2,
    id: 'document_screening',
    title: 'Document Screening',
    desc: 'Automated authenticity & license number verification'
  },
  {
    stage: 3,
    id: 'board_review',
    title: 'Medical Board Verification',
    desc: 'Alternative medicine board credential assessment'
  },
  {
    stage: 4,
    id: 'verified',
    title: 'Verified Practitioner Badge',
    desc: 'Public marketplace profile activation & direct client bookings'
  }
];
