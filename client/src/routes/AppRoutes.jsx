<<<<<<< HEAD
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import ProfilePage from "../modules/auth/pages/ProfilePage";

import PractitionerDashboard from "../modules/practitioner/pages/PractitionerDashboard";
import PractitionerBookingsPage from "../modules/practitioner/pages/PractitionerBookingsPage";

import UserDashboard from "../modules/booking/pages/UserDashboard";
import PractitionerDiscovery from "../modules/booking/pages/PractitionerDiscovery";
import PractitionerProfileView from "../modules/booking/pages/PractitionerProfileView";
import BookingPage from "../modules/booking/pages/BookingPage";
import SessionDetailPage from "../modules/booking/pages/SessionDetailPage";
import MyBookingsPage from "../modules/booking/pages/MyBookingsPage";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import AdminRoute from "./AdminRoute";

import AdminLayout from "../modules/admin/pages/AdminLayout";
import AdminDashboard from "../modules/admin/pages/AdminDashboard";
import Practitioners from "../modules/admin/pages/Practitioners";
import Users from "../modules/admin/pages/Users";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* =========================
                    DEFAULT
                ========================= */}
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                {/* =========================
                    AUTH
                ========================= */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* =========================
                    PROTECTED USER ROUTES
                ========================= */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/profile" element={<ProfilePage />} />

                    {/* Practitioner Discovery & Profiles */}
                    <Route
                        path="/practitioners"
                        element={<PractitionerDiscovery />}
                    />
                    <Route
                        path="/practitioners/:id"
                        element={<PractitionerProfileView />}
                    />

                    {/* Sessions & Booking */}
                    <Route
                        path="/sessions/:id"
                        element={<SessionDetailPage />}
                    />
                    <Route
                        path="/sessions/:id/book"
                        element={<BookingPage />}
                    />
                    <Route
                        path="/my-bookings"
                        element={<MyBookingsPage />}
                    />

                    {/* =====================
                        PRACTITIONER PORTAL
                    ===================== */}
                    <Route
                        element={
                            <RoleRoute roles={["practitioner"]} />
                        }
                    >
                        <Route
                            path="/practitioner"
                            element={<PractitionerDashboard />}
                        />
                        <Route
                            path="/practitioner/bookings"
                            element={<PractitionerBookingsPage />}
                        />
                    </Route>
                </Route>

                {/* =========================
                    ADMIN PORTAL
                ========================= */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route
                        path="practitioners"
                        element={<Practitioners />}
                    />
                    <Route path="users" element={<Users />} />
                </Route>

                {/* Catch-all fallback */}
                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
=======
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { RegisterPage } from '../modules/auth/pages/RegisterPage';
import { OnboardingVerificationPage } from '../modules/practitioner/pages/OnboardingVerificationPage';
import { UserDashboard } from '../components/common/UserDashboard';
import { ROLES } from '../config/constants';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const AppRoutes = () => {
  const { currentUser, isAuthenticated, toastMessage } = useAuth();

  // Primary navigation view state: 'login' | 'register' | 'practitioner-dashboard' | 'user-dashboard'
  const [view, setView] = useState('login');
  const [prefillEmail, setPrefillEmail] = useState('');
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState('');

  // Determine active view
  const getActiveView = () => {
    if (isAuthenticated) {
      if (currentUser?.role === ROLES.PRACTITIONER) {
        return 'practitioner-dashboard';
      }
      return 'user-dashboard';
    }

    if (view === 'register') {
      return 'register';
    }

    return 'login';
  };

  const activeView = getActiveView();

  const handleNavigate = (targetView) => {
    setView(targetView);
  };

  const handleRegistrationComplete = ({ email, message }) => {
    setPrefillEmail(email || '');
    setRegisterSuccessMessage(message || 'Account registered successfully!');
    setView('login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification Container */}
      {toastMessage && (
        <div
          className="clay-card"
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 99999,
            padding: '14px 22px',
            borderRadius: '20px',
            backgroundColor:
              toastMessage.type === 'success'
                ? '#E8F4EC'
                : toastMessage.type === 'error'
                ? 'var(--burst-orange-soft)'
                : 'var(--warm-beige)',
            border:
              toastMessage.type === 'success'
                ? '2px solid var(--forest-primary)'
                : '2px solid var(--burst-orange)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '8px 12px 24px rgba(188, 163, 131, 0.4)',
            animation: 'fadeIn 0.25s ease-out forwards',
          }}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 size={20} color="var(--forest-primary)" />
          ) : (
            <Info size={20} color="var(--burst-orange)" />
          )}
          <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-dark)' }}>
            {toastMessage.message}
          </span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar currentView={activeView} onNavigate={handleNavigate} />

      {/* Main Content View Switcher */}
      <main style={{ flex: 1 }}>
        {activeView === 'login' && (
          <LoginPage
            onNavigate={handleNavigate}
            prefillEmail={prefillEmail}
            registerSuccessMessage={registerSuccessMessage}
          />
        )}

        {activeView === 'register' && (
          <RegisterPage
            onNavigate={handleNavigate}
            onRegistrationComplete={handleRegistrationComplete}
          />
        )}

        {activeView === 'practitioner-dashboard' && <OnboardingVerificationPage />}

        {activeView === 'user-dashboard' && <UserDashboard onNavigate={handleNavigate} />}
      </main>

      {/* Claymorphic Footer */}
      <footer
        style={{
          marginTop: 'auto',
          padding: '24px 20px',
          textAlign: 'center',
          borderTop: '1.5px solid rgba(226, 208, 181, 0.6)',
          backgroundColor: 'rgba(248, 235, 221, 0.95)',
        }}
      >
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          © 2026 <strong>Nurova</strong> — Wellness Marketplace for Alternative Therapies • Module A (Practitioner Onboarding & Verification)
        </p>
        <p className="font-highlight" style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '4px' }}>
          PALETTE: 60% Sand (#F8EBDD) • 25% Warm Beige (#E2D0B5) • 10% Forest (#355C45) • 5% Burst Orange (#C9784B)
        </p>
      </footer>
    </div>
  );
};
>>>>>>> origin/feature/module-a-farha-backend-new
