/**
 * Storage utility for Nurova Frontend
 * Manages accounts, authentication state, and practitioner onboarding documents in localStorage.
 */

const STORAGE_KEYS = {
  CURRENT_USER: 'nurova_current_user',
  USERS_DB: 'nurova_users_db',
  PRACTITIONER_PROFILES: 'nurova_practitioner_profiles',
};

// Default seed accounts for quick testing & demonstration
const DEFAULT_USERS = [
  {
    id: 'user_001',
    email: 'user@nurova.com',
    password: 'password123',
    role: 'user',
    name: 'Aarav Sharma',
    joinedDate: '2026-01-15',
    savedSessions: 2,
    preferences: ['Ayurveda', 'Physiotherapy']
  },
  {
    id: 'prac_001',
    email: 'dr.ananya@nurova.com',
    password: 'password123',
    role: 'practitioner',
    name: 'Dr. Ananya Roy',
    title: 'Senior Ayurvedic Physician & Panchakarma Specialist',
    specialization: 'ayurveda',
    specializationTags: ['Ayurveda', 'Panchakarma', 'Herbal Detox', 'Pulse Diagnosis'],
    licenseNumber: 'AYUR-MED-84920',
    experienceYears: 8,
    clinicName: 'AyurVeda Wellness Sanctuary, Bangalore',
    verificationStatus: 'verified',
    verificationProgress: 100,
    documents: [
      {
        id: 'doc_1',
        type: 'license',
        title: 'Medical Practice License',
        filename: 'Ayush_National_License_AYUR-84920.pdf',
        size: '2.4 MB',
        uploadedAt: '2026-02-10',
        status: 'approved',
        verifiedBy: 'Ayush Verification Board'
      },
      {
        id: 'doc_2',
        type: 'identity',
        title: 'Government Identity Proof',
        filename: 'Passport_Verification_AnanyaRoy.pdf',
        size: '1.8 MB',
        uploadedAt: '2026-02-10',
        status: 'approved',
        verifiedBy: 'Identity Auth API'
      },
      {
        id: 'doc_3',
        type: 'degree',
        title: 'Degree & Certification',
        filename: 'BAMS_Degree_Certificate_GujaratAyurvedUniv.pdf',
        size: '3.1 MB',
        uploadedAt: '2026-02-10',
        status: 'approved',
        verifiedBy: 'Medical Credentials Council'
      }
    ],
    rating: 4.9,
    reviewsCount: 38,
    bio: 'Dedicated practitioner of classical Ayurvedic wisdom with 8+ years specializing in holistic digestive healing, chronic inflammation, and stress relief.',
  },
  {
    id: 'prac_002',
    email: 'practitioner.pending@nurova.com',
    password: 'password123',
    role: 'practitioner',
    name: 'Marcus Vance',
    title: 'Certified Sports Physiotherapist & Spine Care Specialist',
    specialization: 'physiotherapy',
    specializationTags: ['Physiotherapy', 'Post-Op Rehab', 'Dry Needling'],
    licenseNumber: 'PT-REG-2026-4419',
    experienceYears: 5,
    clinicName: 'Apex Kinetic Physio Clinic',
    verificationStatus: 'under_review',
    verificationProgress: 60,
    documents: [
      {
        id: 'doc_10',
        type: 'license',
        title: 'Physiotherapy Board License',
        filename: 'State_Physio_Council_License_4419.pdf',
        size: '1.9 MB',
        uploadedAt: '2026-08-20',
        status: 'under_review',
        verifiedBy: 'Pending Board Review'
      },
      {
        id: 'doc_11',
        type: 'identity',
        title: 'National Identity Proof',
        filename: 'Govt_Identity_Card_MVance.pdf',
        size: '1.2 MB',
        uploadedAt: '2026-08-20',
        status: 'approved',
        verifiedBy: 'Identity Auth API'
      }
    ],
    rating: 0,
    reviewsCount: 0,
    bio: 'Focused on evidence-based musculoskeletal physical therapy, joint mobilization, and postural realignment.',
  }
];

export const storage = {
  getUsers: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS_DB);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Storage error:', e);
      return DEFAULT_USERS;
    }
  },

  saveUser: (newUser) => {
    const users = storage.getUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === newUser.email.toLowerCase());
    
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...newUser };
    } else {
      users.push(newUser);
    }

    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
    return newUser;
  },

  findUserByEmail: (email) => {
    const users = storage.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  },

  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  updateCurrentUserProfile: (updatedData) => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) return null;

    const updated = { ...currentUser, ...updatedData };
    storage.setCurrentUser(updated);
    storage.saveUser(updated);
    return updated;
  }
};
