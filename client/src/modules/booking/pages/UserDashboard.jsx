import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayStatCard from "../../../components/ui/ClayStatCard";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayButton from "../../../components/ui/ClayButton";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayEmptyState from "../../../components/ui/ClayEmptyState";
import {
    Sparkles,
    Calendar,
    Clock,
    Stethoscope,
    ShieldCheck,
    Search,
    ArrowRight,
    HeartPulse,
    UserCheck,
} from "lucide-react";
import {
    getUserDashboardMetrics,
    getVerifiedPractitioners,
} from "../services/bookingService";

const specializations = [
    { label: "All Therapies", value: "" },
    { label: "Physiotherapy", value: "physiotherapy" },
    { label: "Acupuncture", value: "acupuncture" },
    { label: "Ayurveda", value: "Ayurveda" },
    { label: "Chiropractic", value: "chiropractic" },
];

const UserDashboard = () => {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [practitioners, setPractitioners] = useState([]);
    const [selectedSpec, setSelectedSpec] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const [metricsData, practitionersData] = await Promise.all([
                getUserDashboardMetrics(),
                getVerifiedPractitioners({
                    specialization: selectedSpec || undefined,
                    search: searchTerm || undefined,
                }),
            ]);

            setMetrics(metricsData);
            setPractitioners(practitionersData.practitioners || []);
        } catch (err) {
            console.error("USER DASHBOARD LOAD ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedSpec]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadData();
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const greetingTime = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="min-h-screen bg-sand font-georama pb-12">
            <UserNavbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8 animate-page-entrance">
                {/* Hero Greeting Card */}
                <ClayCard
                    level="2"
                    className="relative overflow-hidden p-6 sm:p-8 border border-white/70"
                >
                    {/* Subtle decorative glow */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-forest/5 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-burntOrange/5 blur-3xl pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] border border-white/50">
                                <Sparkles className="w-3.5 h-3.5 text-burntOrange" />
                                <span className="font-bitcount text-burntOrange text-xs font-bold uppercase tracking-wider">
                                    HOLISTIC CARE
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold text-forest tracking-tight">
                                {greetingTime()},{" "}
                                {user?.username || user?.email?.split("@")[0] || "Friend"}
                            </h1>

                            <p className="text-sm sm:text-base font-medium text-forest/75 leading-relaxed">
                                Find verified holistic practitioners, schedule therapeutic sessions, and nurture your wellbeing.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <Link to="/practitioners">
                                <ClayButton
                                    variant="forest"
                                    size="md"
                                    fullWidth={false}
                                    icon={Search}
                                >
                                    Find Practitioner
                                </ClayButton>
                            </Link>

                            <Link to="/my-bookings">
                                <ClayButton
                                    variant="beige"
                                    size="md"
                                    fullWidth={false}
                                    icon={Calendar}
                                >
                                    My Bookings
                                </ClayButton>
                            </Link>
                        </div>
                    </div>
                </ClayCard>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <ClayStatCard
                        title="Upcoming Sessions"
                        value={metrics?.upcomingBookings?.length || 0}
                        description="Active confirmed appointments"
                        icon={Calendar}
                    />

                    <ClayStatCard
                        title="Total Bookings"
                        value={metrics?.totalBookingsCount || 0}
                        description="Sessions booked to date"
                        icon={HeartPulse}
                    />

                    <ClayStatCard
                        title="Verified Specialists"
                        value={metrics?.verifiedPractitionersCount || 0}
                        description="Approved healthcare providers"
                        icon={ShieldCheck}
                    />
                </div>

                {/* Next Upcoming Session Banner (if any) */}
                {metrics?.upcomingBookings && metrics.upcomingBookings.length > 0 && (
                    <ClayCard
                        level="2"
                        className="p-6 border-l-4 border-l-forest bg-warmBeige/90"
                    >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-forest text-sand flex items-center justify-center flex-shrink-0 shadow-[2px_2px_5px_rgba(53,92,69,0.2)]">
                                    <Clock className="w-6 h-6" />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <ClayBadge status="approved" size="sm">
                                            Next Upcoming Session
                                        </ClayBadge>
                                        <span className="text-xs font-bold text-forest/60 capitalize">
                                            {metrics.upcomingBookings[0].session?.specialization}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-forest">
                                        {metrics.upcomingBookings[0].session?.title || "Therapy Session"}
                                    </h3>

                                    <p className="text-xs sm:text-sm font-semibold text-forest/70 flex items-center gap-3 flex-wrap">
                                        <span>
                                            With Dr.{" "}
                                            {metrics.upcomingBookings[0].practitioner?.username ||
                                                metrics.upcomingBookings[0].practitioner?.email}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {formatTime(metrics.upcomingBookings[0].session?.startAt)}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <Link
                                to={`/sessions/${metrics.upcomingBookings[0].session?._id}`}
                                className="flex-shrink-0 self-end sm:self-center"
                            >
                                <ClayButton
                                    variant="forest"
                                    size="sm"
                                    fullWidth={false}
                                    icon={ArrowRight}
                                >
                                    View Session
                                </ClayButton>
                            </Link>
                        </div>
                    </ClayCard>
                )}

                {/* Verified Practitioner Discovery Showcase */}
                <section className="space-y-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-bitcount text-burntOrange text-xs uppercase font-bold tracking-wider">
                                    DISCOVERY
                                </span>
                            </div>
                            <h2 className="text-2xl font-extrabold text-forest">
                                Verified Practitioners
                            </h2>
                            <p className="text-xs sm:text-sm text-forest/70 font-medium">
                                Connect with licensed specialists across holistic fields.
                            </p>
                        </div>

                        <Link to="/practitioners">
                            <ClayButton
                                variant="beige"
                                size="sm"
                                fullWidth={false}
                                icon={ArrowRight}
                            >
                                Browse All
                            </ClayButton>
                        </Link>
                    </div>

                    {/* Specialization Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {specializations.map((spec) => (
                            <button
                                key={spec.value}
                                type="button"
                                onClick={() => setSelectedSpec(spec.value)}
                                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                    selectedSpec === spec.value
                                        ? "clay-btn-forest text-sand !shadow-[3px_3px_8px_rgba(53,92,69,0.25)] !transform-none"
                                        : "text-forest/70 hover:text-forest bg-warmBeige shadow-[2px_2px_4px_rgba(53,92,69,0.06),-2px_-2px_4px_rgba(255,255,255,0.7)]"
                                }`}
                            >
                                {spec.label}
                            </button>
                        ))}
                    </div>

                    {/* Practitioners Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[1, 2, 3].map((i) => (
                                <ClayCard key={i} level="2" className="p-6 space-y-3">
                                    <ClaySkeleton className="h-12 w-12 rounded-2xl" />
                                    <ClaySkeleton className="h-5 w-32" />
                                    <ClaySkeleton className="h-4 w-full" />
                                    <ClaySkeleton className="h-10 w-full rounded-xl mt-4" />
                                </ClayCard>
                            ))}
                        </div>
                    ) : !practitioners.length ? (
                        <ClayEmptyState
                            icon={Stethoscope}
                            title="No Verified Practitioners Found"
                            description="There are currently no approved practitioners matching this specialization."
                        />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {practitioners.slice(0, 6).map((p) => {
                                const initial = (
                                    p.username?.[0] ||
                                    p.email?.[0] ||
                                    "P"
                                ).toUpperCase();

                                return (
                                    <ClayCard
                                        key={p._id}
                                        level="2"
                                        interactive
                                        className="p-6 flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-forest text-sand flex items-center justify-center text-lg font-bold shadow-[2px_2px_5px_rgba(53,92,69,0.2)]">
                                                    {initial}
                                                </div>

                                                <ClayBadge
                                                    status="approved"
                                                    size="sm"
                                                >
                                                    Verified
                                                </ClayBadge>
                                            </div>

                                            <div>
                                                <h3 className="text-base font-bold text-forest">
                                                    {p.username || p.email}
                                                </h3>
                                                <p className="text-xs font-bold text-burntOrange capitalize mt-0.5">
                                                    {p.specialization || "Holistic Practitioner"}
                                                </p>
                                            </div>

                                            <p className="text-xs text-forest/70 line-clamp-2 leading-relaxed font-medium">
                                                {p.bio || "Dedicated healthcare practitioner providing personalized treatments."}
                                            </p>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-forest/10 flex items-center justify-between gap-2">
                                            <span className="text-[11px] font-bold text-forest/60">
                                                {p.availableSessionCount || 0} slot
                                                {p.availableSessionCount !== 1 ? "s" : ""} open
                                            </span>

                                            <Link to={`/practitioners/${p._id}`}>
                                                <ClayButton
                                                    variant="forest"
                                                    size="sm"
                                                    fullWidth={false}
                                                    icon={Calendar}
                                                >
                                                    View & Book
                                                </ClayButton>
                                            </Link>
                                        </div>
                                    </ClayCard>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default UserDashboard;
