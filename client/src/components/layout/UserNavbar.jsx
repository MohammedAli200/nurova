import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
    LogOut,
    User,
    Stethoscope,
    Shield,
    Sparkles,
    Menu,
    X,
    LayoutDashboard,
    Calendar,
    Search,
    Users,
} from "lucide-react";
import ClayBadge from "../ui/ClayBadge";

/**
 * UserNavbar Component
 * Tactile navigation header for User, Practitioner, and Portal views with responsive mobile menu.
 */
const UserNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) return null;

    const initial = (user.username?.[0] || user.email?.[0] || "U").toUpperCase();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="w-full font-georama sticky top-0 z-40 px-3 sm:px-6 lg:px-8 py-3">
            <div className="max-w-6xl mx-auto clay-surface-2 bg-warmBeige/90 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 border border-white/80 shadow-[6px_8px_20px_rgba(53,92,69,0.08),-6px_-6px_16px_rgba(255,255,255,0.9)]">
                {/* Brand Logo */}
                <Link
                    to={user.role === "admin" ? "/admin" : user.role === "practitioner" ? "/practitioner" : "/dashboard"}
                    className="flex items-center gap-2.5 group cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <div className="w-9 h-9 rounded-2xl bg-warmBeige flex items-center justify-center text-burntOrange shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/60 group-hover:scale-105 group-hover:shadow-[inset_2px_2px_5px_rgba(201,120,75,0.2)] transition-all duration-200">
                        <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                    </div>
                    <div>
                        <span className="font-bitcount text-burntOrange text-lg tracking-wider uppercase font-bold block leading-none">
                            NUROVA
                        </span>
                        <span className="text-[10px] uppercase font-bold text-forest/60 tracking-widest leading-none">
                            Wellness
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-warmBeige/70 shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] border border-white/40">
                    <Link
                        to="/dashboard"
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                            isActive("/dashboard")
                                ? "clay-btn-forest text-sand !shadow-[2px_3px_8px_rgba(53,92,69,0.25)] !transform-none"
                                : "text-forest/75 hover:text-forest hover:bg-white/40"
                        }`}
                    >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        to="/practitioners"
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isActive("/practitioners")
                                ? "clay-btn-forest text-sand !shadow-[3px_3px_8px_rgba(53,92,69,0.25)] !transform-none"
                                : "text-forest/75 hover:text-forest hover:bg-white/40"
                        }`}
                    >
                        <Search className="w-3.5 h-3.5" />
                        <span>Discover</span>
                    </Link>

                    <Link
                        to="/my-bookings"
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isActive("/my-bookings")
                                ? "clay-btn-forest text-sand !shadow-[3px_3px_8px_rgba(53,92,69,0.25)] !transform-none"
                                : "text-forest/75 hover:text-forest hover:bg-white/40"
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>My Bookings</span>
                    </Link>
                       <Link
                        to="/marketplace"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            isActive("/marketplace")
                                ? "clay-btn-forest text-sand !transform-none"
                                : "text-forest/80 hover:text-forest hover:bg-white/40"
                        }`}
                    >
                        Marketplace
                    </Link>
                    {user.role === "practitioner" && (
                          <>
                            <Link
                                to="/practitioner"
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    isActive("/practitioner")
                                        ? "clay-btn-forest text-sand !shadow-[3px_3px_8px_rgba(53,92,69,0.25)] !transform-none"
                                        : "text-forest/75 hover:text-forest hover:bg-white/40"
                                }`}
                            >
                                <Stethoscope className="w-3.5 h-3.5" />
                                <span>Workspace</span>
                            </Link>

                            <Link
                                to="/practitioner/bookings"
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    isActive("/practitioner/bookings")
                                        ? "clay-btn-forest text-sand !shadow-[3px_3px_8px_rgba(53,92,69,0.25)] !transform-none"
                                        : "text-forest/75 hover:text-forest hover:bg-white/40"
                                }`}
                            >
                                <Users className="w-3.5 h-3.5" />
                                <span>Clients</span>
                            </Link>
                        </>
                    )}

                    {user.role === "admin" && (
                        <Link
                            to="/admin"
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                location.pathname.startsWith("/admin")
                                    ? "clay-btn-forest text-sand !shadow-[3px_3px_8px_rgba(53,92,69,0.25)] !transform-none"
                                    : "text-forest/75 hover:text-forest hover:bg-white/40"
                            }`}
                        >
                            <Shield className="w-3.5 h-3.5" />
                            <span>Admin Portal</span>
                        </Link>
                    )}
                </nav>

                {/* User Avatar & Logout */}
                <div className="flex items-center gap-2.5">
                    {/* User Profile Link Badge */}
                    <Link
                        to="/profile"
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-warmBeige shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.85)] border border-white/40 hover:border-forest/40 transition-colors"
                    >
                        <div className="w-7 h-7 rounded-xl bg-forest text-sand flex items-center justify-center text-xs font-bold shadow-[1px_1px_3px_rgba(53,92,69,0.2)]">
                            {initial}
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-xs font-bold text-forest leading-tight max-w-[120px] truncate">
                                {user.username || user.email}
                            </p>
                            <p className="text-[10px] font-bold text-burntOrange capitalize leading-tight">
                                {user.role}
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Logout Button */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="hidden md:flex px-3 py-2 rounded-xl text-xs font-bold text-forest bg-warmBeige shadow-[3px_3px_6px_rgba(53,92,69,0.1),-3px_-3px_6px_rgba(255,255,255,0.8)] hover:text-burntOrange hover:shadow-[1px_1px_3px_rgba(53,92,69,0.1),-1px_-1px_3px_rgba(255,255,255,0.8)] active:shadow-[inset_2px_2px_4px_rgba(53,92,69,0.12)] transition-all items-center gap-1.5 cursor-pointer"
                        title="Sign out"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                    </button>

                    {/* Mobile Menu Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-xl text-forest bg-warmBeige shadow-[2px_2px_5px_rgba(53,92,69,0.1),-2px_-2px_5px_rgba(255,255,255,0.8)] active:shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1)] transition-all cursor-pointer"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden mt-2 max-w-6xl mx-auto clay-surface-2 p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            isActive("/dashboard")
                                ? "clay-btn-forest text-sand !transform-none"
                                : "text-forest/80 hover:text-forest hover:bg-white/40"
                        }`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>User Dashboard</span>
                    </Link>

                    <Link
                        to="/practitioners"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            isActive("/practitioners")
                                ? "clay-btn-forest text-sand !transform-none"
                                : "text-forest/80 hover:text-forest hover:bg-white/40"
                        }`}
                    >
                        <Search className="w-4 h-4" />
                        <span>Discover Practitioners</span>
                    </Link>

                    <Link
                        to="/my-bookings"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            isActive("/my-bookings")
                                ? "clay-btn-forest text-sand !transform-none"
                                : "text-forest/80 hover:text-forest hover:bg-white/40"
                        }`}
                    >
                         <Calendar className="w-4 h-4" />
                        <span>My Bookings</span>
                    </Link>

                    <Link
                        to="/marketplace"
                        className={isActive("/marketplace") ? "text-forest font-semibold" : ""}
                    >
                        Marketplace
                    </Link>
                     <Link
                     to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            isActive("/profile")
                                ? "clay-btn-forest text-sand !transform-none"
                                : "text-forest/80 hover:text-forest hover:bg-white/40"
                        }`}
                    >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                    </Link>

                    {user.role === "practitioner" && (
                        <>
                            <Link
                                to="/practitioner"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    isActive("/practitioner")
                                        ? "clay-btn-forest text-sand !transform-none"
                                        : "text-forest/80 hover:text-forest hover:bg-white/40"
                                }`}
                            >
                                <Stethoscope className="w-4 h-4" />
                                <span>Practitioner Workspace</span>
                            </Link>

                            <Link
                                to="/practitioner/bookings"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    isActive("/practitioner/bookings")
                                        ? "clay-btn-forest text-sand !transform-none"
                                        : "text-forest/80 hover:text-forest hover:bg-white/40"
                                }`}
                            >
                                <Users className="w-4 h-4" />
                                <span>Client Bookings</span>
                            </Link>
                        </>
                    )}

                    {user.role === "admin" && (
                        <Link
                            to="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                location.pathname.startsWith("/admin")
                                    ? "clay-btn-forest text-sand !transform-none"
                                    : "text-forest/80 hover:text-forest hover:bg-white/40"
                            }`}
                        >
                            <Shield className="w-4 h-4" />
                            <span>Admin Portal</span>
                        </Link>
                    )}

                    <div className="pt-2 border-t border-forest/10">
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                handleLogout();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-burntOrange bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.8)] cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default UserNavbar;
