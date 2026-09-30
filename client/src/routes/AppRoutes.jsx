import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import ProfilePage from "../modules/auth/pages/ProfilePage";
import MarketplacePage from "../modules/marketplace/pages/MarketplacePage";

import PractitionerDashboard from "../modules/practitioner/pages/PractitionerDashboard";
import PractitionerBookingsPage from "../modules/practitioner/pages/PractitionerBookingsPage";
import PractitionerProductsPage from "../modules/practitioner/pages/PractitionerProductsPage";

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
                    {/* Module A / shared profile */}
                    <Route
                        path="/profile"
                        element={<ProfilePage />}
                    />

                    {/* Module B - User Dashboard */}
                    <Route
                        path="/dashboard"
                        element={<UserDashboard />}
                    />

                    {/* Module B - Practitioner Discovery */}
                    <Route
                        path="/practitioners"
                        element={<PractitionerDiscovery />}
                    />

                    <Route
                        path="/practitioners/:id"
                        element={<PractitionerProfileView />}
                    />

                    {/* Module B - Sessions & Booking */}
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
                    <Route
                     path="/marketplace"
                   element={<MarketplacePage />}
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
                        <Route
                            path="/practitioner/products"
                            element={<PractitionerProductsPage />}
                         />
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
                    <Route
                        index
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="practitioners"
                        element={<Practitioners />}
                    />

                    <Route
                        path="users"
                        element={<Users />}
                    />
                </Route>

                {/* =========================
                    FALLBACK
                ========================= */}
                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;