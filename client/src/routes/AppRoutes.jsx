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
import PractitionerProductsPage from "../modules/practitioner/pages/PractitionerProductsPage";

import UserDashboard from "../modules/booking/pages/UserDashboard";
import PractitionerDiscovery from "../modules/booking/pages/PractitionerDiscovery";
import PractitionerProfileView from "../modules/booking/pages/PractitionerProfileView";
import BookingPage from "../modules/booking/pages/BookingPage";
import SessionDetailPage from "../modules/booking/pages/SessionDetailPage";
import MyBookingsPage from "../modules/booking/pages/MyBookingsPage";

import MarketplacePage from "../modules/marketplace/pages/MarketplacePage";

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

                    {/* Marketplace */}
                    <Route
                        path="/marketplace"
                        element={<MarketplacePage />}
                    />

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
                        <Route
                            path="/practitioner/products"
                            element={<PractitionerProductsPage />}
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