import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Stethoscope, Users, LogOut, User, Sparkles, Menu, X, Shield } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

const AdminSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const links = [
        {
            label: "Dashboard",
            path: "/admin",
            icon: LayoutDashboard,
            end: true,
        },
        {
            label: "Practitioners",
            path: "/admin/practitioners",
            icon: Stethoscope,
            end: false,
        },
        {
            label: "User Directory",
            path: "/admin/users",
            icon: Users,
            end: false,
        },
    ];

    return (
        <>
            {/* Mobile / Tablet Admin Top Header */}
            <div className="md:hidden w-full clay-surface-2 p-4 mb-4 flex items-center justify-between">
                <Link to="/admin" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-warmBeige flex items-center justify-center text-burntOrange shadow-[inset_2px_2px_4px_rgba(53,92,69,0.12),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/50">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="font-bitcount text-burntOrange text-base tracking-wider uppercase font-bold block leading-none">
                            NUROVA
                        </span>
                        <span className="text-[9px] font-bold text-forest/60 uppercase tracking-wider block">
                            Admin Portal
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-xl text-forest bg-warmBeige shadow-[2px_2px_5px_rgba(53,92,69,0.1),-2px_-2px_5px_rgba(255,255,255,0.8)] active:shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1)] transition-all cursor-pointer"
                        aria-label="Toggle Admin Navigation"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Dropdown */}
            {mobileOpen && (
                <div className="md:hidden w-full clay-surface-2 p-4 mb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <nav className="space-y-2">
                        {links.map((link) => {
                            const Icon = link.icon;
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    end={link.end}
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                                            isActive
                                                ? "clay-btn-forest text-sand !transform-none shadow-[3px_3px_8px_rgba(53,92,69,0.25)]"
                                                : "text-forest/75 hover:text-forest hover:bg-white/40"
                                        }`
                                    }
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{link.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="pt-3 border-t border-forest/10 flex items-center justify-between gap-3">
                        <Link
                            to="/profile"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 text-xs font-bold text-forest hover:text-burntOrange"
                        >
                            <User className="w-4 h-4 text-forest/60" />
                            <span>{user?.username || user?.email}</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                setMobileOpen(false);
                                handleLogout();
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-burntOrange bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.8)] cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop Persistent Sidebar */}
            <aside className="hidden md:block w-64 lg:w-72 shrink-0 font-georama">
                <div className="clay-surface-2 p-5 sm:p-6 sticky top-6">
                    {/* Brand Header */}
                    <div className="flex items-center justify-between pb-5 mb-5 border-b border-forest/10">
                        <Link to="/admin" className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-warmBeige flex items-center justify-center text-burntOrange shadow-[inset_2px_2px_4px_rgba(53,92,69,0.12),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/50">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-bitcount text-burntOrange text-xl tracking-wider uppercase font-bold block leading-none">
                                    NUROVA
                                </span>
                                <span className="text-[11px] font-bold text-forest/60 uppercase tracking-wider block mt-0.5">
                                    Admin Portal
                                </span>
                            </div>
                        </Link>

                        <span className="w-2 h-2 rounded-full bg-forest animate-pulse" title="System Online" />
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-2.5">
                        {links.map((link) => {
                            const Icon = link.icon;
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    end={link.end}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                                            isActive
                                                ? "clay-btn-forest !shadow-[4px_4px_10px_rgba(53,92,69,0.28)] !transform-none text-sand"
                                                : "text-forest/70 hover:text-forest hover:bg-white/40 shadow-[2px_2px_4px_rgba(53,92,69,0.06),-2px_-2px_4px_rgba(255,255,255,0.7)]"
                                        }`
                                    }
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{link.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* Admin User Footer / Quick Actions */}
                    <div className="mt-8 pt-5 border-t border-forest/10 space-y-3">
                        <Link
                            to="/profile"
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-forest/70 hover:text-forest hover:bg-white/30 transition-all"
                        >
                            <User className="w-4 h-4 text-forest/50" />
                            <div className="flex-1 truncate">
                                <p className="font-bold text-forest truncate">{user?.username || user?.email}</p>
                                <p className="text-[10px] text-forest/50">My Profile</p>
                            </div>
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-forest bg-warmBeige shadow-[3px_3px_6px_rgba(53,92,69,0.1),-3px_-3px_6px_rgba(255,255,255,0.8)] hover:text-burntOrange hover:shadow-[1px_1px_3px_rgba(53,92,69,0.1),-1px_-1px_3px_rgba(255,255,255,0.8)] active:shadow-[inset_2px_2px_4px_rgba(53,92,69,0.12)] transition-all cursor-pointer"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;