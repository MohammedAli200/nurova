import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Stethoscope, Clock, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { getDashboardStats } from "../services/adminService";
import ClayStatCard from "../../../components/ui/ClayStatCard";
import ClayCard from "../../../components/ui/ClayCard";
import ClayButton from "../../../components/ui/ClayButton";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayErrorState from "../../../components/ui/ClayErrorState";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");
            const result = await getDashboardStats();
            setStats(result.stats);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to load administrative dashboard statistics."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 font-georama">
                {/* Header Skeleton */}
                <div className="space-y-2">
                    <ClaySkeleton className="h-5 w-24" />
                    <ClaySkeleton className="h-9 w-64" />
                    <ClaySkeleton className="h-4 w-96" />
                </div>

                {/* Stat Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="clay-surface-2 p-6 space-y-3">
                            <ClaySkeleton className="h-4 w-28" />
                            <ClaySkeleton className="h-10 w-20" />
                            <ClaySkeleton className="h-3 w-40" />
                        </div>
                    ))}
                </div>

                {/* Callout Skeleton */}
                <ClaySkeleton className="h-44 w-full rounded-3xl" />
            </div>
        );
    }

    if (error) {
        return (
            <ClayErrorState
                title="Dashboard Load Failure"
                message={error}
                onRetry={loadDashboard}
            />
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 font-georama animate-page-entrance">
            {/* Header Section */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bitcount text-burntOrange text-xs sm:text-sm tracking-widest uppercase font-bold">
                        SYSTEM OVERVIEW
                    </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-forest tracking-tight">
                    Admin Dashboard
                </h1>

                <p className="text-forest/70 mt-1.5 text-sm font-medium">
                    Monitor practitioner approvals, registered members, and platform health.
                </p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <ClayStatCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    description="Registered patient & user accounts"
                    icon={Users}
                />

                <ClayStatCard
                    title="All Practitioners"
                    value={stats?.totalPractitioners || 0}
                    description="Total healthcare professional applications"
                    icon={Stethoscope}
                />

                <ClayStatCard
                    title="Pending Approval"
                    value={stats?.pendingPractitioners || 0}
                    description="Applications awaiting license review"
                    icon={Clock}
                />

                <ClayStatCard
                    title="Approved"
                    value={stats?.approvedPractitioners || 0}
                    description="Active verified practitioners"
                    icon={CheckCircle2}
                />

                <ClayStatCard
                    title="Rejected"
                    value={stats?.rejectedPractitioners || 0}
                    description="Applications declined verification"
                    icon={XCircle}
                />
            </div>

            {/* Practitioner Approval Action Card */}
            <ClayCard level="2" className="p-7 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-1.5">
                        <ShieldCheck className="w-5 h-5 text-forest" />
                        <h2 className="text-xl sm:text-2xl font-bold text-forest">
                            Practitioner Credential Review
                        </h2>
                    </div>

                    <p className="text-forest/75 text-sm font-medium leading-relaxed mt-1">
                        Review practitioner medical licenses, certificate documents, and credentials to ensure patient safety before granting consultation privileges.
                    </p>

                    {stats?.pendingPractitioners > 0 ? (
                        <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-warmBeige text-burntOrange font-bold text-xs shadow-[inset_2px_2px_4px_rgba(201,120,75,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-burntOrange/20">
                            <span className="w-2 h-2 rounded-full bg-burntOrange animate-ping" />
                            <span>
                                {stats.pendingPractitioners} application
                                {stats.pendingPractitioners !== 1 ? "s" : ""} waiting for your review
                            </span>
                        </div>
                    ) : (
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-warmBeige text-forest/70 font-semibold text-xs shadow-[inset_2px_2px_4px_rgba(53,92,69,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]">
                            <CheckCircle2 className="w-4 h-4 text-forest" />
                            <span>All practitioner applications are up to date!</span>
                        </div>
                    )}
                </div>

                <Link to="/admin/practitioners" className="flex-shrink-0">
                    <ClayButton
                        variant="forest"
                        size="md"
                        fullWidth={false}
                        icon={ArrowRight}
                    >
                        Manage Practitioners
                    </ClayButton>
                </Link>
            </ClayCard>
        </div>
    );
};

export default AdminDashboard;