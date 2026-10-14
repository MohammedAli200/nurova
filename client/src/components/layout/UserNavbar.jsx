import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Sparkles,
  LayoutDashboard,
  Search,
  Calendar,
  ShoppingBag,
  MessageSquare,
  Stethoscope,
  Package,
  Users,
  Shield,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react";

/**
 * UserNavbar Component
 * Redesigned, balanced, responsive navigation for Nurova.
 * Layout: [LOGO] [Main Navigation Links] [Role-Specific Actions] [Profile & Session]
 */
const UserNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [practitionerDropdownOpen, setPractitionerDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setPractitionerDropdownOpen(false);
  }, [location.pathname]);

  // Handle ESC key to close menus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setPractitionerDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPractitionerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/dashboard" || path === "/practitioner") {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const initial = (
    user?.name?.[0] ||
    user?.username?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();

  const role = user?.role || "guest";
  const isPractitioner = role === "practitioner";
  const isAdmin = role === "admin";
  const isUser = role === "user" || role === "patient";

  const brandHomeLink = !user
    ? "/marketplace"
    : isAdmin
    ? "/admin"
    : isPractitioner
    ? "/practitioner"
    : "/dashboard";

  return (
    <header className="w-full font-georama sticky top-0 z-40 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-all duration-200">
      <div className="max-w-7xl mx-auto clay-surface-2 bg-warmBeige/95 backdrop-blur-md px-3.5 sm:px-5 lg:px-6 py-2 rounded-2xl sm:rounded-3xl flex items-center justify-between gap-2 sm:gap-4 border border-white/80 shadow-[0_6px_20px_rgba(53,92,69,0.08),inset_1px_1px_2px_rgba(255,255,255,0.85)]">
        {/* ========================================================= */}
        {/* 1. BRAND LOGO                                             */}
        {/* ========================================================= */}
        <Link
          to={brandHomeLink}
          className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer flex-shrink-0 select-none"
          aria-label="Nurova Home"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-warmBeige flex items-center justify-center text-burntOrange shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/60 group-hover:scale-105 group-hover:shadow-[inset_2px_2px_5px_rgba(201,120,75,0.25)] transition-all duration-200">
            <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <div className="hidden xs:block">
            <span className="font-bitcount text-burntOrange text-base sm:text-lg tracking-wider uppercase font-bold block leading-none">
              NUROVA
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-forest/60 tracking-widest leading-none">
              Wellness
            </span>
          </div>
        </Link>

        {/* ========================================================= */}
        {/* 2. DESKTOP MAIN NAVIGATION LINKS                          */}
        {/* ========================================================= */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 rounded-2xl bg-warmBeige/60 shadow-[inset_1px_1px_3px_rgba(53,92,69,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.8)] border border-white/40 flex-shrink min-w-0"
          aria-label="Main Navigation"
        >
          {/* Normal User & Admin: Dashboard */}
          {(!user || isUser || isAdmin) && (
            <Link
              to={user ? "/dashboard" : "/marketplace"}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                isActive("/dashboard")
                  ? "clay-btn-forest text-sand !shadow-[2px_2px_6px_rgba(53,92,69,0.25)] !transform-none"
                  : "text-forest/75 hover:text-forest hover:bg-white/40"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Dashboard</span>
            </Link>
          )}

          {/* Discover Practitioners */}
          <Link
            to="/practitioners"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
              isActive("/practitioners")
                ? "clay-btn-forest text-sand !shadow-[2px_2px_6px_rgba(53,92,69,0.25)] !transform-none"
                : "text-forest/75 hover:text-forest hover:bg-white/40"
            }`}
          >
            <Search className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Discover</span>
          </Link>

          {/* Normal User: My Bookings */}
          {user && (isUser || !isPractitioner) && !isAdmin && (
            <Link
              to="/my-bookings"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                isActive("/my-bookings")
                  ? "clay-btn-forest text-sand !shadow-[2px_2px_6px_rgba(53,92,69,0.25)] !transform-none"
                  : "text-forest/75 hover:text-forest hover:bg-white/40"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>My Bookings</span>
            </Link>
          )}

          {/* Product Store / Marketplace */}
          <Link
            to="/marketplace"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
              isActive("/marketplace")
                ? "clay-btn-forest text-sand !shadow-[2px_2px_6px_rgba(53,92,69,0.25)] !transform-none"
                : "text-forest/75 hover:text-forest hover:bg-white/40"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Marketplace</span>
          </Link>

          {/* Community Q&A Forum */}
          <Link
            to="/community"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
              isActive("/community")
                ? "clay-btn-forest text-sand !shadow-[2px_2px_6px_rgba(53,92,69,0.25)] !transform-none"
                : "text-forest/75 hover:text-forest hover:bg-white/40"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Community</span>
          </Link>
        </nav>

        {/* ========================================================= */}
        {/* 3. ROLE-SPECIFIC ACTIONS (PRACTITIONER / ADMIN)           */}
        {/* ========================================================= */}
        {user && (
          <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
            {/* PRACTITIONER TOOLS */}
            {isPractitioner && (
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-forest/5 border border-forest/15">
                <Link
                  to="/practitioner"
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    location.pathname === "/practitioner"
                      ? "bg-forest text-sand shadow-[1px_2px_5px_rgba(53,92,69,0.25)]"
                      : "text-forest/80 hover:text-forest hover:bg-white/50"
                  }`}
                  title="Practitioner Workspace"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-burntOrange" />
                  <span className="hidden xl:inline">Workspace</span>
                </Link>

                <Link
                  to="/practitioner/products"
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive("/practitioner/products")
                      ? "bg-forest text-sand shadow-[1px_2px_5px_rgba(53,92,69,0.25)]"
                      : "text-forest/80 hover:text-forest hover:bg-white/50"
                  }`}
                  title="Product Store Management"
                >
                  <Package className="w-3.5 h-3.5 text-burntOrange" />
                  <span>My Products</span>
                </Link>

                <Link
                  to="/practitioner/bookings"
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive("/practitioner/bookings")
                      ? "bg-forest text-sand shadow-[1px_2px_5px_rgba(53,92,69,0.25)]"
                      : "text-forest/80 hover:text-forest hover:bg-white/50"
                  }`}
                  title="Patient Bookings"
                >
                  <Users className="w-3.5 h-3.5 text-burntOrange" />
                  <span className="hidden xl:inline">Clients</span>
                </Link>
              </div>
            )}

            {/* ADMIN PORTAL LINK */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-burntOrange/30 ${
                  location.pathname.startsWith("/admin")
                    ? "clay-btn-forest text-sand !transform-none shadow-[2px_2px_6px_rgba(53,92,69,0.25)]"
                    : "text-forest/80 hover:text-forest hover:bg-white/40"
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-burntOrange" />
                <span>Admin Portal</span>
              </Link>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. PROFILE & AUTHENTICATION ACTIONS                       */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {user ? (
            <>
              {/* Profile Card Pill */}
              <Link
                to="/profile"
                className="flex items-center gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-2xl bg-warmBeige shadow-[inset_1.5px_1.5px_3px_rgba(53,92,69,0.08),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.85)] border border-white/60 hover:border-forest/40 transition-colors"
                title="View Profile"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-forest text-sand flex items-center justify-center text-xs font-bold shadow-[1px_1px_3px_rgba(53,92,69,0.2)] flex-shrink-0">
                  {initial}
                </div>
                <div className="text-left hidden md:block max-w-[100px] xl:max-w-[130px] truncate">
                  <p className="text-xs font-bold text-forest leading-tight truncate">
                    {user.name || user.username || user.email}
                  </p>
                  <p className="text-[10px] font-bold text-burntOrange capitalize leading-tight">
                    {user.role}
                  </p>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="hidden md:flex px-2.5 py-1.5 rounded-xl text-xs font-bold text-forest bg-warmBeige shadow-[2px_2px_5px_rgba(53,92,69,0.08),-2px_-2px_5px_rgba(255,255,255,0.85)] hover:text-burntOrange hover:shadow-[1px_1px_3px_rgba(53,92,69,0.1),-1px_-1px_3px_rgba(255,255,255,0.85)] active:shadow-[inset_2px_2px_4px_rgba(53,92,69,0.12)] transition-all items-center gap-1.5 cursor-pointer"
                title="Sign out of Nurova"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Logout</span>
              </button>
            </>
          ) : (
            /* Unauthenticated Visitor Actions */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-forest bg-warmBeige/80 shadow-[2px_2px_5px_rgba(53,92,69,0.08),-2px_-2px_5px_rgba(255,255,255,0.85)] hover:bg-white hover:text-forest transition-all flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-sand bg-forest shadow-[2px_2px_6px_rgba(53,92,69,0.25)] hover:bg-forest/90 transition-all flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. MOBILE / TABLET MENU TOGGLE BUTTON                     */}
          {/* ========================================================= */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-forest bg-warmBeige shadow-[2px_2px_5px_rgba(53,92,69,0.08),-2px_-2px_5px_rgba(255,255,255,0.85)] active:shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1)] transition-all cursor-pointer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. RESPONSIVE MOBILE / TABLET DRAWER                      */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden mt-2 max-w-7xl mx-auto clay-surface-2 bg-warmBeige/98 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/80 shadow-[0_10px_30px_rgba(53,92,69,0.12)] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Main Seeker Navigation */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-forest/50 px-3 py-1 tracking-wider">
              Navigation
            </p>

            {(!user || isUser || isAdmin) && (
              <Link
                to={user ? "/dashboard" : "/marketplace"}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive("/dashboard")
                    ? "clay-btn-forest text-sand !transform-none"
                    : "text-forest/80 hover:text-forest hover:bg-white/40"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                <span>Dashboard</span>
              </Link>
            )}

            <Link
              to="/practitioners"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive("/practitioners")
                  ? "clay-btn-forest text-sand !transform-none"
                  : "text-forest/80 hover:text-forest hover:bg-white/40"
              }`}
            >
              <Search className="w-4 h-4 flex-shrink-0" />
              <span>Discover Practitioners</span>
            </Link>

            {user && (isUser || !isPractitioner) && !isAdmin && (
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive("/my-bookings")
                    ? "clay-btn-forest text-sand !transform-none"
                    : "text-forest/80 hover:text-forest hover:bg-white/40"
                }`}
              >
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>My Bookings</span>
              </Link>
            )}

            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive("/marketplace")
                  ? "clay-btn-forest text-sand !transform-none"
                  : "text-forest/80 hover:text-forest hover:bg-white/40"
              }`}
            >
              <ShoppingBag className="w-4 h-4 flex-shrink-0" />
              <span>Wellness Marketplace</span>
            </Link>

            <Link
              to="/community"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive("/community")
                  ? "clay-btn-forest text-sand !transform-none"
                  : "text-forest/80 hover:text-forest hover:bg-white/40"
              }`}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span>Community Q&A Forum</span>
            </Link>
          </div>

          {/* Practitioner Specific Section */}
          {isPractitioner && (
            <div className="pt-2 border-t border-forest/10 space-y-1">
              <p className="text-[10px] uppercase font-bold text-burntOrange px-3 py-1 tracking-wider">
                Practitioner Workspace
              </p>

              <Link
                to="/practitioner"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  location.pathname === "/practitioner"
                    ? "clay-btn-forest text-sand !transform-none"
                    : "text-forest/80 hover:text-forest hover:bg-white/40"
                }`}
              >
                <Stethoscope className="w-4 h-4 flex-shrink-0 text-burntOrange" />
                <span>Clinical Dashboard</span>
              </Link>

              <Link
                to="/practitioner/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive("/practitioner/products")
                    ? "clay-btn-forest text-sand !transform-none"
                    : "text-forest/80 hover:text-forest hover:bg-white/40"
                }`}
              >
                <Package className="w-4 h-4 flex-shrink-0 text-burntOrange" />
                <span>Product Store Management</span>
              </Link>

              <Link
                to="/practitioner/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive("/practitioner/bookings")
                    ? "clay-btn-forest text-sand !transform-none"
                    : "text-forest/80 hover:text-forest hover:bg-white/40"
                }`}
              >
                <Users className="w-4 h-4 flex-shrink-0 text-burntOrange" />
                <span>Patient Bookings</span>
              </Link>
            </div>
          )}

          {/* Admin Specific Section */}
          {isAdmin && (
            <div className="pt-2 border-t border-forest/10 space-y-1">
              <p className="text-[10px] uppercase font-bold text-burntOrange px-3 py-1 tracking-wider">
                Admin Controls
              </p>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  location.pathname.startsWith("/admin")
                    ? "clay-btn-forest text-sand !transform-none"
                    : "text-forest/80 hover:text-forest hover:bg-white/40"
                }`}
              >
                <Shield className="w-4 h-4 flex-shrink-0 text-burntOrange" />
                <span>Admin Portal</span>
              </Link>
            </div>
          )}

          {/* Profile & Auth Section */}
          <div className="pt-2 border-t border-forest/10 space-y-1">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive("/profile")
                      ? "clay-btn-forest text-sand !transform-none"
                      : "text-forest/80 hover:text-forest hover:bg-white/40"
                  }`}
                >
                  <UserIcon className="w-4 h-4 flex-shrink-0" />
                  <span>Account Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-burntOrange bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] hover:bg-white/60 transition-all cursor-pointer mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-forest bg-warmBeige shadow-[2px_2px_5px_rgba(53,92,69,0.08)]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-sand bg-forest shadow-[2px_2px_6px_rgba(53,92,69,0.25)]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
