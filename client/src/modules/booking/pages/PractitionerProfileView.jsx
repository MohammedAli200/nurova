import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayButton from "../../../components/ui/ClayButton";
import ClayCalendar from "../../../components/ui/ClayCalendar";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayEmptyState from "../../../components/ui/ClayEmptyState";
import ClayErrorState from "../../../components/ui/ClayErrorState";
import {
    Calendar,
    Clock,
    Mail,
    Stethoscope,
    ShieldCheck,
    ArrowLeft,
    Sparkles,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { getPractitionerProfile } from "../services/bookingService";

const PractitionerProfileView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [practitioner, setPractitioner] = useState(null);
    const [allAvailableSessions, setAllAvailableSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");
            const result = await getPractitionerProfile(id);

            setPractitioner(result.practitioner);
            setAllAvailableSessions(result.availableSessions || []);

            // If available sessions exist, preselect the earliest available session's date
            if (result.availableSessions && result.availableSessions.length > 0) {
                const firstDate = result.availableSessions[0].startAt.slice(0, 10);
                setSelectedDate(firstDate);
            }
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to load practitioner profile."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [id]);

    // Format calendar events for highlights
    const calendarEvents = allAvailableSessions.map((s) => ({
        date: s.startAt.slice(0, 10),
        status: "available",
    }));

    // Filter available sessions for the selected calendar date
    const selectedDateSessions = allAvailableSessions.filter(
        (s) => s.startAt.slice(0, 10) === selectedDate
    );

    // Group sessions by Morning (< 12:00) vs Afternoon / Evening (>= 12:00)
    const morningSessions = selectedDateSessions.filter((s) => {
        const hour = new Date(s.startAt).getHours();
        return hour < 12;
    });

    const afternoonSessions = selectedDateSessions.filter((s) => {
        const hour = new Date(s.startAt).getHours();
        return hour >= 12;
    });

    const formatTimeRange = (startStr, endStr) => {
        const start = new Date(startStr);
        const end = new Date(endStr);
        const startFormatted = start.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
        const endFormatted = end.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
        return `${startFormatted} – ${endFormatted}`;
    };

    const formatSelectedDateHeading = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(`${dateStr}T00:00:00`);
        return d.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const initial = (
        practitioner?.username?.[0] ||
        practitioner?.email?.[0] ||
        "P"
    ).toUpperCase();

    if (loading) {
        return (
            <div className="min-h-screen bg-sand font-georama pb-12">
                <UserNavbar />
                <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
                    <ClaySkeleton className="h-48 w-full rounded-3xl" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ClaySkeleton className="h-80 rounded-3xl" />
                        <ClaySkeleton className="h-80 rounded-3xl" />
                    </div>
                </main>
            </div>
        );
    }

    if (error || !practitioner) {
        return (
            <div className="min-h-screen bg-sand font-georama pb-12">
                <UserNavbar />
                <main className="max-w-2xl mx-auto px-4 pt-12">
                    <ClayErrorState
                        title="Practitioner Not Available"
                        message={error || "Unable to display this practitioner."}
                        onRetry={loadProfile}
                    />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sand font-georama pb-12">
            <UserNavbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 animate-page-entrance">
                {/* Back Link */}
                <div>
                    <Link
                        to="/practitioners"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-forest/70 hover:text-burntOrange transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to All Practitioners</span>
                    </Link>
                </div>

                {/* Practitioner Hero Header */}
                <ClayCard level="2" className="p-6 sm:p-8 relative overflow-hidden border border-white/70">
                    {/* Subtle decorative blob */}
                    <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-forest/5 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-burntOrange/5 blur-3xl pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                        <div className="w-20 h-20 rounded-3xl bg-forest text-sand flex items-center justify-center text-3xl font-extrabold shadow-[4px_4px_14px_rgba(53,92,69,0.25)] flex-shrink-0">
                            {initial}
                        </div>

                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-forest">
                                    {practitioner.username || practitioner.email}
                                </h1>
                                <ClayBadge status="approved" size="sm">
                                    Verified Practitioner
                                </ClayBadge>
                            </div>

                            <p className="text-sm font-bold text-burntOrange capitalize">
                                {practitioner.specialization || "Holistic Practitioner"}
                            </p>

                            <p className="text-sm text-forest/80 leading-relaxed max-w-2xl font-medium pt-1">
                                {practitioner.bio ||
                                    "Dedicated holistic therapist focused on restorative care and personalized healing sessions."}
                            </p>

                            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-forest/60">
                                <span className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" />
                                    {practitioner.email}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5 text-forest font-bold">
                                    <Calendar className="w-3.5 h-3.5 text-burntOrange" />
                                    {allAvailableSessions.length} total open session
                                    {allAvailableSessions.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>
                    </div>
                </ClayCard>

                {/* Calendar & Available Sessions Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: Reusable Calendar Widget (5 cols) */}
                    <div className="lg:col-span-5 space-y-3">
                        <div className="flex items-center justify-between ml-1">
                            <h2 className="text-base font-bold text-forest">
                                Select Appointment Date
                            </h2>
                            <span className="text-[11px] font-bold text-burntOrange">
                                • Available Dots
                            </span>
                        </div>

                        <ClayCalendar
                            selectedDate={selectedDate}
                            onSelectDate={(date) => setSelectedDate(date)}
                            events={calendarEvents}
                            minDate={new Date().toISOString().split("T")[0]}
                        />
                    </div>

                    {/* Right: Available Sessions for Selected Date (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        <ClayCard level="2" className="p-6">
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-forest/10">
                                <div>
                                    <span className="font-bitcount text-burntOrange text-xs uppercase font-bold tracking-wider">
                                        AVAILABLE SLOTS
                                    </span>
                                    <h3 className="text-lg font-bold text-forest mt-0.5">
                                        {formatSelectedDateHeading(selectedDate)}
                                    </h3>
                                </div>

                                <ClayBadge status="forest" size="sm">
                                    {selectedDateSessions.length} available
                                </ClayBadge>
                            </div>

                            {/* No Sessions Empty State */}
                            {!selectedDateSessions.length ? (
                                <ClayEmptyState
                                    icon={Calendar}
                                    title="No Sessions Available"
                                    description="No therapy sessions are available on this date. Please select another date highlighted on the calendar."
                                />
                            ) : (
                                <div className="space-y-5">
                                    {/* Morning Sessions */}
                                    {morningSessions.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-forest/60">
                                                Morning Sessions
                                            </h4>

                                            <div className="space-y-3">
                                                {morningSessions.map((session) => (
                                                    <SessionCard
                                                        key={session._id}
                                                        session={session}
                                                        formatTimeRange={formatTimeRange}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Afternoon & Evening Sessions */}
                                    {afternoonSessions.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-forest/60">
                                                Afternoon & Evening
                                            </h4>

                                            <div className="space-y-3">
                                                {afternoonSessions.map((session) => (
                                                    <SessionCard
                                                        key={session._id}
                                                        session={session}
                                                        formatTimeRange={formatTimeRange}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </ClayCard>
                    </div>
                </div>
            </main>
        </div>
    );
};

/**
 * Subcomponent for individual session slot
 */
const SessionCard = ({ session, formatTimeRange }) => {
    return (
        <div className="p-4 sm:p-5 rounded-2xl bg-warmBeige shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),inset_-1px_-1px_3px_rgba(53,92,69,0.08)] border border-white/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-forest/40 hover:-translate-y-0.5 hover:shadow-clay-subtle transition-all duration-200">
            <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <Clock className="w-3.5 h-3.5 text-burntOrange" />
                    <span className="text-xs font-bold text-forest">
                        {formatTimeRange(session.startAt, session.endAt)}
                    </span>
                    <span className="text-[10px] font-bold text-forest/60 bg-white/50 px-2 py-0.5 rounded-full border border-white/40">
                        {session.duration} min
                    </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-forest">
                    {session.title}
                </h4>

                {session.description && (
                    <p className="text-xs text-forest/70 line-clamp-1 font-medium">
                        {session.description}
                    </p>
                )}
            </div>

            <Link
                to={`/sessions/${session._id}/book`}
                className="flex-shrink-0 self-end sm:self-center w-full sm:w-auto"
            >
                <ClayButton
                    variant="forest"
                    size="sm"
                    fullWidth={true}
                    icon={Sparkles}
                >
                    Book Session
                </ClayButton>
            </Link>
        </div>
    );
};

export default PractitionerProfileView;
