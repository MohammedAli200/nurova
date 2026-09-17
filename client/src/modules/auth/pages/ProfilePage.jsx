import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayButton from "../../../components/ui/ClayButton";
import { Mail, User, ShieldCheck, Stethoscope, FileText, ArrowRight } from "lucide-react";

const ProfilePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const initial = (user?.username?.[0] || user?.email?.[0] || "U").toUpperCase();

    return (
        <div className="min-h-screen bg-sand font-georama pb-12">
            <UserNavbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 animate-page-entrance">
                {/* Profile Hero Header Card */}
                <ClayCard level="2" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden border border-white/70">
                    <div className="flex items-center gap-5">
                        {/* Large Avatar Initial Pill */}
                        <div className="w-20 h-20 rounded-3xl bg-forest text-sand flex items-center justify-center text-3xl font-extrabold shadow-[5px_5px_12px_rgba(53,92,69,0.25),-4px_-4px_10px_rgba(255,255,255,0.8)] border-2 border-white/40 flex-shrink-0">
                            {initial}
                        </div>

                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-forest">
                                    {user?.username || user?.email?.split("@")[0]}
                                </h1>
                                <ClayBadge
                                    status={user?.role === "admin" ? "forest" : user?.role === "practitioner" ? (user?.isApproved ? "approved" : "pending") : "neutral"}
                                    size="sm"
                                >
                                    {user?.role}
                                </ClayBadge>
                            </div>

                            <p className="text-sm font-medium text-forest/70 mt-1 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-forest/50" />
                                <span>{user?.email}</span>
                            </p>
                        </div>
                    </div>

                    {/* Quick navigation actions if role matches */}
                    {user?.role === "practitioner" && (
                        <Link to="/practitioner">
                            <ClayButton
                                variant="forest"
                                size="md"
                                fullWidth={false}
                                icon={ArrowRight}
                            >
                                Practitioner Space
                            </ClayButton>
                        </Link>
                    )}

                    {user?.role === "admin" && (
                        <Link to="/admin">
                            <ClayButton
                                variant="forest"
                                size="md"
                                fullWidth={false}
                                icon={ArrowRight}
                            >
                                Admin Dashboard
                            </ClayButton>
                        </Link>
                    )}
                </ClayCard>

                {/* Practitioner Verification Banner (if practitioner) */}
                {user?.role === "practitioner" && (
                    <ClayCard
                        level="1"
                        className={`p-5 sm:p-6 flex items-start gap-4 ${
                            user?.isApproved
                                ? "border-forest/30"
                                : "border-burntOrange/30"
                        }`}
                    >
                        <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                user?.isApproved
                                    ? "bg-forest text-sand shadow-[2px_2px_6px_rgba(53,92,69,0.2)]"
                                    : "bg-burntOrange text-white shadow-[2px_2px_6px_rgba(201,120,75,0.25)]"
                            }`}
                        >
                            <ShieldCheck className="w-5 h-5" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <h3 className="text-base font-bold text-forest">
                                    Practitioner Verification Status
                                </h3>
                                <ClayBadge
                                    status={user?.isApproved ? "approved" : "pending"}
                                    size="sm"
                                >
                                    {user?.isApproved ? "Approved by Admin" : "Awaiting Approval"}
                                </ClayBadge>
                            </div>
                            <p className="text-xs sm:text-sm text-forest/70 mt-1 leading-relaxed">
                                {user?.isApproved
                                    ? "Your credentials have been verified. You have full access to practitioner capabilities."
                                    : "Your application and uploaded documents are currently under review by the Nurova administration."}
                            </p>
                        </div>
                    </ClayCard>
                )}

                {/* User Credentials Detail Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <ClayCard level="1" className="p-5">
                        <div className="flex items-center gap-2 text-forest/60 mb-1">
                            <Mail className="w-4 h-4 text-burntOrange" />
                            <p className="text-xs font-bold uppercase tracking-wider">
                                Email Address
                            </p>
                        </div>
                        <p className="text-base font-bold text-forest mt-0.5">
                            {user?.email}
                        </p>
                    </ClayCard>

                    <ClayCard level="1" className="p-5">
                        <div className="flex items-center gap-2 text-forest/60 mb-1">
                            <User className="w-4 h-4 text-burntOrange" />
                            <p className="text-xs font-bold uppercase tracking-wider">
                                Username
                            </p>
                        </div>
                        <p className="text-base font-bold text-forest mt-0.5">
                            {user?.username || "—"}
                        </p>
                    </ClayCard>

                    <ClayCard level="1" className="p-5">
                        <div className="flex items-center gap-2 text-forest/60 mb-1">
                            <ShieldCheck className="w-4 h-4 text-burntOrange" />
                            <p className="text-xs font-bold uppercase tracking-wider">
                                Account Role
                            </p>
                        </div>
                        <p className="text-base font-bold text-forest capitalize mt-0.5">
                            {user?.role}
                        </p>
                    </ClayCard>

                    {user?.specialization ? (
                        <ClayCard level="1" className="p-5">
                            <div className="flex items-center gap-2 text-forest/60 mb-1">
                                <Stethoscope className="w-4 h-4 text-burntOrange" />
                                <p className="text-xs font-bold uppercase tracking-wider">
                                    Specialization
                                </p>
                            </div>
                            <p className="text-base font-bold text-forest capitalize mt-0.5">
                                {user?.specialization}
                            </p>
                        </ClayCard>
                    ) : (
                        <ClayCard level="1" className="p-5">
                            <div className="flex items-center gap-2 text-forest/60 mb-1">
                                <ShieldCheck className="w-4 h-4 text-burntOrange" />
                                <p className="text-xs font-bold uppercase tracking-wider">
                                    Membership
                                </p>
                            </div>
                            <p className="text-base font-bold text-forest mt-0.5">
                                Active Member
                            </p>
                        </ClayCard>
                    )}
                </div>

                {/* Bio Section */}
                <ClayCard level="1" className="p-6">
                    <div className="flex items-center gap-2 text-forest/60 mb-2">
                        <FileText className="w-4 h-4 text-burntOrange" />
                        <p className="text-xs font-bold uppercase tracking-wider">
                            About / Bio
                        </p>
                    </div>
                    <p className="text-sm font-medium text-forest/80 leading-relaxed">
                        {user?.bio || "No bio has been added yet."}
                    </p>
                </ClayCard>
            </main>
        </div>
    );
};

export default ProfilePage;