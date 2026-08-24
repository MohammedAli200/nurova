import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { ROLES, VERIFICATION_STATUSES } from '../config/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => storage.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    // Sync current user from storage on mount
    const saved = storage.getCurrentUser();
    if (saved) {
      setCurrentUser(saved);
    }
  }, []);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  /**
   * Log in user or practitioner
   */
  const login = async (email, password) => {
    setLoading(true);
    // Simulate brief network latency for realistic feel
    await new Promise((r) => setTimeout(r, 400));

    const user = storage.findUserByEmail(email);

    if (!user) {
      setLoading(false);
      return {
        success: false,
        error: 'No account found with this email address. Please register first.'
      };
    }

    if (user.password !== password) {
      setLoading(false);
      return {
        success: false,
        error: 'Incorrect password. Please try again or use the demo credentials.'
      };
    }

    // Set active user
    storage.setCurrentUser(user);
    setCurrentUser(user);
    setLoading(false);
    showToast(`Welcome back, ${user.name || user.email}!`, 'success');

    return {
      success: true,
      user
    };
  };

  /**
   * Register new user or practitioner
   */
  const register = async (registrationData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const { email, password, role } = registrationData;

    // Check if email already exists
    const existing = storage.findUserByEmail(email);
    if (existing) {
      setLoading(false);
      return {
        success: false,
        error: 'An account with this email already exists. Please login instead.'
      };
    }

    const isPractitioner = role === ROLES.PRACTITIONER;

    const newUser = {
      id: `${role}_${Date.now()}`,
      email: email.trim(),
      password: password,
      role: role,
      name: registrationData.name || (isPractitioner ? 'Practitioner' : 'Wellness Seeker'),
      joinedDate: new Date().toISOString().split('T')[0],
      // If practitioner, attach onboarding and verification specifics
      ...(isPractitioner && {
        title: registrationData.title || 'Alternative Therapy Practitioner',
        specialization: registrationData.specialization || 'ayurveda',
        specializationTags: registrationData.specializationTags || [registrationData.specialization || 'Ayurveda'],
        licenseNumber: registrationData.licenseNumber || 'PENDING-REG-000',
        experienceYears: Number(registrationData.experienceYears) || 1,
        clinicName: registrationData.clinicName || 'Holistic Care Practice',
        verificationStatus: VERIFICATION_STATUSES.UNDER_REVIEW,
        verificationProgress: 45,
        documents: registrationData.documents || [],
        rating: 0,
        reviewsCount: 0,
        bio: registrationData.bio || 'Dedicated wellness practitioner providing holistic alternative care.',
      }),
      // If regular user
      ...(!isPractitioner && {
        savedSessions: 0,
        preferences: ['Ayurveda', 'Physiotherapy']
      })
    };

    storage.saveUser(newUser);
    setLoading(false);

    return {
      success: true,
      user: newUser
    };
  };

  /**
   * Logout
   */
  const logout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  /**
   * Update practitioner verification status (Simulator helper for evaluation)
   */
  const updatePractitionerStatus = (newStatus) => {
    if (!currentUser || currentUser.role !== ROLES.PRACTITIONER) return;

    let progress = 40;
    if (newStatus === VERIFICATION_STATUSES.UNDER_REVIEW) progress = 70;
    if (newStatus === VERIFICATION_STATUSES.VERIFIED) progress = 100;
    if (newStatus === VERIFICATION_STATUSES.ACTION_REQUIRED) progress = 50;

    const updated = storage.updateCurrentUserProfile({
      verificationStatus: newStatus,
      verificationProgress: progress
    });

    setCurrentUser(updated);
    showToast(`Verification status updated to: ${newStatus.replace('_', ' ').toUpperCase()}`, 'success');
  };

  /**
   * Add document to current practitioner profile
   */
  const addPractitionerDocument = (newDoc) => {
    if (!currentUser || currentUser.role !== ROLES.PRACTITIONER) return;

    const existingDocs = currentUser.documents || [];
    const updatedDocs = [...existingDocs, newDoc];

    const updated = storage.updateCurrentUserProfile({
      documents: updatedDocs
    });

    setCurrentUser(updated);
    showToast(`Document "${newDoc.title}" uploaded for verification!`, 'success');
  };

  /**
   * Remove document
   */
  const removePractitionerDocument = (docId) => {
    if (!currentUser || currentUser.role !== ROLES.PRACTITIONER) return;

    const updatedDocs = (currentUser.documents || []).filter((d) => d.id !== docId);
    const updated = storage.updateCurrentUserProfile({
      documents: updatedDocs
    });

    setCurrentUser(updated);
    showToast('Document removed from records', 'info');
  };

  /**
   * Update specialization tags
   */
  const updateSpecializationTags = (tags) => {
    if (!currentUser || currentUser.role !== ROLES.PRACTITIONER) return;

    const updated = storage.updateCurrentUserProfile({
      specializationTags: tags
    });

    setCurrentUser(updated);
    showToast('Therapy specializations updated!', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role || null,
        loading,
        toastMessage,
        showToast,
        login,
        register,
        logout,
        updatePractitionerStatus,
        addPractitionerDocument,
        removePractitionerDocument,
        updateSpecializationTags,
        setCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
