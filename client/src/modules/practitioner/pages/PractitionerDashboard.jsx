import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayStatCard from "../../../components/ui/ClayStatCard";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayButton from "../../../components/ui/ClayButton";
import ClayCalendar from "../../../components/ui/ClayCalendar";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayEmptyState from "../../../components/ui/ClayEmptyState";
import ClayModal from "../../../components/ui/ClayModal";
import ScheduleTherapyModal from "../components/ScheduleTherapyModal";
import {
    Stethoscope,
    ShieldCheck,
    Clock,
    User,
    Award,
    Calendar,
    Sparkles,
    Plus,
    Users,
    ArrowRight,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { useToast } from "../../../contexts/ToastContext";
import {
    getPractitionerSessions,
    cancelPractitionerSession,
} from "../../booking/services/bookingService";

const PractitionerDashboard = () => {
    const { user } = useAuth();
    const toast = useToast();
    const isApproved =
        user?.isApproved === true || user?.approvalStatus === "approved" || user?.verificationStatus === "approved";

    const [sessions, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });
    const [loading, setLoading] = useState(false);
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [sessionToCancel, setSessionToCancel] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [cancelError, setCancelError] = useState("");

    const loadSessions = async () => {
        if (!isApproved) return;
        try {
            setLoading(true);
            const result = await getPractitionerSessions();
            setSessions(result.sessions || []);
        } catch (err) {
            console.error("FAILED TO LOAD PRACTITIONER SESSIONS:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmCancel = async () => {
        if (!sessionToCancel) return;
        try {
            setCancelLoading(true);
            setCancelError("");
            await cancelPractitionerSession(sessionToCancel._id);
            toast.success("Therapy session cancelled successfully.", "Session Cancelled");
            setSessionToCancel(null);
            await loadSessions();
        } catch (err) {
            console.error("FAILED TO CANCEL SESSION:", err);
            const msg = err.response?.data?.message || "Failed to cancel therapy session.";
            setCancelError(msg);
            toast.error(msg, "Cancellation Failed");
        } finally {
            setCancelLoading(false);
        }
    };

    useEffect(() => {
        loadSessions();
    }, [isApproved]);

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    // Metrics calculations
    const todaySessionsCount = sessions.filter(
        (s) => s.startAt.slice(0, 10) === todayStr && s.status !== "cancelled"
    ).length;

    const upcomingSessionsCount = sessions.filter(
        (s) => new Date(s.startAt) > now && s.status !== "cancelled"
    ).length;

    const bookedSessionsCount = sessions.filter(
        (s) => s.status === "booked"
    ).length;

    const availableSlotsCount = sessions.filter(
        (s) => s.status === "available" && new Date(s.startAt) > now
    ).length;

    // Calendar events
    const calendarEvents = sessions.map((s) => ({
        date: s.startAt.slice(0, 10),
        status: s.status,
    }));

    // Selected date sessions
    const selectedDateSessions = sessions.filter(
        (s) => s.startAt.slice(0, 10) === selectedDate
    );

    const formatTimeRange = (startStr, endStr) => {
        if (!startStr || !endStr) return "";
        const start = new Date(startStr);
        const end = new Date(endStr);
        return `${start.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        })} – ${end.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        })}`;
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

    return (
        <div className="min-h-screen bg-sand font-georama pb-12">
            <UserNavbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 animate-page-entrance">
                {/* Header Banner */}
                <ClayCard level="2" className="relative overflow-hidden p-6 sm:p-8 border border-white/70">
                    {/* Subtle decorative glow */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-forest/5 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-burntOrange/5 blur-3xl pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bitcount text-burntOrange text-xs sm:text-sm tracking-wider uppercase font-bold">
                                    PRACTITIONER PORTAL
                                </span>
                                <ClayBadge
                                    status={isApproved ? "approved" : "pending"}
                                    size="sm"
                                >
                                    {isApproved
                                        ? "Verified Practitioner"
                                        : "Pending Verification"}
                                </ClayBadge>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold text-forest tracking-tight">
                                Welcome, Dr. {user?.username || user?.email?.split("@")[0]}
                            </h1>

                            <p className="text-forest/70 font-medium text-sm">
                                {user?.email} · Clinical focus in{" "}
                                <span className="text-forest font-bold capitalize">
                                    {user?.specialization || "Holistic Care"}
                                </span>
                            </p>
                        </div>

                        {isApproved && (
                            <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
                                <ClayButton
                                    type="button"
                                    variant="forest"
                                    size="md"
                                    fullWidth={false}
                                    icon={Plus}
                                    onClick={() => setScheduleModalOpen(true)}
                                >
                                    Schedule Therapy
                                </ClayButton>

                                <Link to="/practitioner/bookings">
                                    <ClayButton
                                        variant="beige"
                                        size="md"
                                        fullWidth={false}
                                        icon={Users}
                                    >
                                        Client Bookings
                                    </ClayButton>
                                </Link>

                                <Link to="/practitioner/products">
                                    <ClayButton
                                        variant="beige"
                                        size="md"
                                        fullWidth={false}
                                    >
                                        Manage Products
                                    </ClayButton>
                                </Link>
                            </div>
                        )}
                    </div>
                </ClayCard>

                {/* Verification Notice Banner */}
                {!isApproved ? (
                    <ClayCard
                        level="1"
                        className="border-l-4 border-l-burntOrange p-5 sm:p-6 flex items-start gap-4"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-burntOrange text-white flex items-center justify-center flex-shrink-0 shadow-[2px_2px_6px_rgba(201,120,75,0.3)]">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-forest">
                                Credential Verification in Progress
                            </h3>
                            <p className="text-sm text-forest/70 mt-1 leading-relaxed">
                                Your application and uploaded license documentation are currently undergoing review by the Nurova compliance team. Once approved, you will unlock full practitioner therapy scheduling, calendar management, and client consultations.
                            </p>
                        </div>
                    </ClayCard>
                ) : (
                    <ClayCard
                        level="1"
                        className="border-l-4 border-l-forest p-5 sm:p-6 flex items-start gap-4"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-forest text-sand flex items-center justify-center flex-shrink-0 shadow-[2px_2px_6px_rgba(53,92,69,0.3)]">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-forest">
                                Verified Practitioner Status
                            </h3>
                            <p className="text-sm text-forest/70 mt-1 leading-relaxed">
                                Your account is verified and in good standing. Your published availability is visible to clients across the Nurova network.
                            </p>
                        </div>
                    </ClayCard>
                )}

                {/* Live Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <ClayStatCard
                        title="Today's Sessions"
                        value={isApproved ? todaySessionsCount : 0}
                        description="Scheduled for today"
                        icon={Calendar}
                    />

                    <ClayStatCard
                        title="Upcoming Sessions"
                        value={isApproved ? upcomingSessionsCount : 0}
                        description="Future therapy sessions"
                        icon={Clock}
                    />

                    <ClayStatCard
                        title="Booked by Clients"
                        value={isApproved ? bookedSessionsCount : 0}
                        description="Confirmed appointments"
                        icon={Users}
                    />

                    <ClayStatCard
                        title="Available Slots"
                        value={isApproved ? availableSlotsCount : 0}
                        description="Open for client booking"
                        icon={Sparkles}
                    />
                </div>

                {/* Practitioner Calendar and Schedule Section (if approved) */}
                {isApproved && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Calendar Widget (5 cols) */}
                        <div className="lg:col-span-5 space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <h2 className="text-base font-bold text-forest">
                                    Therapy Calendar
                                </h2>
                                <span className="text-[11px] font-bold text-forest/60">
                                    Select date to manage
                                </span>
                            </div>

                            <ClayCalendar
                                selectedDate={selectedDate}
                                onSelectDate={(date) => setSelectedDate(date)}
                                events={calendarEvents}
                            />
                        </div>

                        {/* Sessions for Selected Date (7 cols) */}
                        <div className="lg:col-span-7 space-y-4">
                            <ClayCard level="2" className="p-6">
                                <div className="flex items-center justify-between pb-4 mb-4 border-b border-forest/10">
                                    <div>
                                        <span className="font-bitcount text-burntOrange text-xs uppercase font-bold tracking-wider">
                                            SCHEDULED SESSIONS
                                        </span>
                                        <h3 className="text-lg font-bold text-forest mt-0.5">
                                            {formatSelectedDateHeading(selectedDate)}
                                        </h3>
                                    </div>

                                    <ClayButton
                                        type="button"
                                        variant="forest"
                                        size="sm"
                                        fullWidth={false}
                                        icon={Plus}
                                        onClick={() => setScheduleModalOpen(true)}
                                    >
                                        Add Slot
                                    </ClayButton>
                                </div>

                                {!selectedDateSessions.length ? (
                                    <ClayEmptyState
                                        icon={Calendar}
                                        title="No Sessions Scheduled"
                                        description="You have not scheduled any therapy sessions for this date."
                                        actionLabel="Schedule Therapy"
                                        onAction={() => setScheduleModalOpen(true)}
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        {selectedDateSessions.map((s) => (
                                            <div
                                                key={s._id}
                                                className="p-4 rounded-2xl bg-warmBeige shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),inset_-1px_-1px_3px_rgba(53,92,69,0.08)] border border-white/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                            >
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-burntOrange" />
                                                        <span className="text-xs font-bold text-forest">
                                                            {formatTimeRange(s.startAt, s.endAt)}
                                                        </span>
                                                        <ClayBadge
                                                            status={
                                                                s.status === "available"
                                                                    ? "forest"
                                                                    : s.status === "booked"
                                                                      ? "approved"
                                                                      : s.status === "cancelled"
                                                                        ? "rejected"
                                                                        : "neutral"
                                                            }
                                                            size="sm"
                                                        >
                                                            {s.status}
                                                        </ClayBadge>
                                                    </div>

                                                    <h4 className="text-sm font-bold text-forest">
                                                        {s.title}
                                                    </h4>

                                                    {s.booking?.user && (
                                                        <p className="text-xs font-semibold text-forest/80 flex items-center gap-1.5 pt-0.5">
                                                            <User className="w-3 h-3 text-burntOrange" />
                                                            <span>
                                                                Booked by:{" "}
                                                                {s.booking.user.username ||
                                                                    s.booking.user.email}
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                                                    {s.status !== "cancelled" &&
                                                        s.status !== "completed" &&
                                                        new Date(s.startAt) > new Date() && (
                                                            <ClayButton
                                                                variant="danger"
                                                                size="sm"
                                                                fullWidth={false}
                                                                icon={XCircle}
                                                                onClick={() => {
                                                                    setCancelError("");
                                                                    setSessionToCancel(s);
                                                                }}
                                                            >
                                                                Cancel
                                                            </ClayButton>
                                                        )}

                                                    <Link to={`/sessions/${s._id}`}>
                                                        <ClayButton
                                                            variant="beige"
                                                            size="sm"
                                                            fullWidth={false}
                                                            icon={ArrowRight}
                                                        >
                                                            Details
                                                        </ClayButton>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ClayCard>
                        </div>
                    </div>
                )}

                {/* Professional Bio Summary */}
                <ClayCard level="1" className="p-6 sm:p-7">
                    <h3 className="text-lg font-bold text-forest mb-2">
                        Professional Profile Summary
                    </h3>
                    <p className="text-sm font-medium text-forest/80 leading-relaxed">
                        {user?.bio ||
                            "No biography provided. Update your profile to include your clinical approach and treatment philosophy."}
                    </p>
                </ClayCard>
            </main>

            {/* Schedule Therapy Modal */}
            <ScheduleTherapyModal
                isOpen={scheduleModalOpen}
                onClose={() => setScheduleModalOpen(false)}
                onSessionCreated={loadSessions}
                defaultSpecialization={user?.specialization}
            />

            {/* Cancel Session Confirmation Modal */}
            {sessionToCancel && (
                <ClayModal
                    isOpen={!!sessionToCancel}
                    onClose={() => {
                        if (!cancelLoading) {
                            setSessionToCancel(null);
                            setCancelError("");
                        }
                    }}
                    subtitle="PRACTITIONER ACTION"
                    title="Cancel this therapy session?"
                    maxWidth="max-w-md"
                >
                    <div className="space-y-4 font-georama text-left">
                        <p className="text-sm font-medium text-forest/80 leading-relaxed">
                            This action will cancel the session and notify the affected user if the session has already been booked.
                        </p>

                        <div className="p-3.5 rounded-2xl bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] border border-white/40 text-xs">
                            <p className="font-bold text-forest truncate">
                                {sessionToCancel.title}
                            </p>
                            <p className="text-forest/70 mt-0.5">
                                {formatTimeRange(sessionToCancel.startAt, sessionToCancel.endAt)}
                            </p>
                            {sessionToCancel.status === "booked" && sessionToCancel.booking?.user && (
                                <p className="text-burntOrange font-bold mt-1">
                                    • Booked client: {sessionToCancel.booking.user.username || sessionToCancel.booking.user.email}
                                </p>
                            )}
                        </div>

                        {cancelError && (
                            <p className="text-xs font-bold text-rose-600">
                                {cancelError}
                            </p>
                        )}

                        <div className="pt-2 flex gap-3">
                            <ClayButton
                                variant="beige"
                                size="md"
                                fullWidth
                                disabled={cancelLoading}
                                onClick={() => {
                                    setSessionToCancel(null);
                                    setCancelError("");
                                }}
                            >
                                Keep Session
                            </ClayButton>

                            <ClayButton
                                variant="danger"
                                size="md"
                                fullWidth
                                loading={cancelLoading}
                                onClick={handleConfirmCancel}
                                icon={XCircle}
                            >
                                Cancel Session
                            </ClayButton>
                        </div>
                    </div>
                </ClayModal>
            )}
        </div>
    );
};

export default PractitionerDashboard;