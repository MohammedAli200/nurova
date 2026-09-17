import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayButton from "../../../components/ui/ClayButton";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayErrorState from "../../../components/ui/ClayErrorState";
import ClayModal from "../../../components/ui/ClayModal";
import { useToast } from "../../../contexts/ToastContext";
import {
    Calendar,
    Clock,
    User,
    Mail,
    Stethoscope,
    ShieldCheck,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileText,
    Sparkles,
} from "lucide-react";
import {
    getSessionById,
    cancelPractitionerSession,
} from "../services/bookingService";

const SessionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [cancelMessage, setCancelMessage] = useState("");

    const loadSession = async () => {
        try {
            setLoading(true);
            setError("");
            const result = await getSessionById(id);
            setSession(result.session);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to load session details."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSession();
    }, [id]);

    const handleConfirmCancellation = async () => {
        try {
            setCancelLoading(true);
            setError("");
            await cancelPractitionerSession(id);
            setCancelModalOpen(false);
            setCancelMessage(
                "Therapy session has been successfully cancelled."
            );
            toast.success("Therapy session has been cancelled.", "Session Cancelled");
            await loadSession();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Failed to cancel therapy session.";
            setError(msg);
            toast.error(msg, "Cancellation Failed");
            setCancelModalOpen(false);
        } finally {
            setCancelLoading(false);
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

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

    if (loading) {
        return (
            <div className="min-h-screen bg-sand font-georama pb-12">
                <UserNavbar />
                <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-6 animate-page-entrance">
                    <ClaySkeleton className="h-48 w-full rounded-3xl" />
                    <ClaySkeleton className="h-64 w-full rounded-3xl" />
                </main>
            </div>
        );
    }

    if (error && !session) {
        return (
            <div className="min-h-screen bg-sand font-georama pb-12">
                <UserNavbar />
                <main className="max-w-xl mx-auto px-4 pt-12 animate-page-entrance">
                    <ClayErrorState
                        title="Session Not Found"
                        message={error || "Unable to display this therapy session."}
                        onRetry={loadSession}
                    />
                </main>
            </div>
        );
    }

    const isBooked = session.status === "booked";
    const isCancelled = session.status === "cancelled";
    const isAvailable = session.status === "available";

    // Determine if logged-in user is the owner practitioner
    const isOwnerPractitioner =
        user &&
        session.practitioner &&
        (user._id === session.practitioner._id ||
            user._id === session.practitioner);

    const isFuture = new Date(session.startAt) > new Date();
    const canCancel = isOwnerPractitioner && !isCancelled && isFuture;

    return (
        <div className="min-h-screen bg-sand font-georama pb-12">
            <UserNavbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 animate-page-entrance">
                {/* Back Link */}
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-forest/70 hover:text-burntOrange transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>

                    {canCancel && (
                        <button
                            type="button"
                            onClick={() => setCancelModalOpen(true)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-burntOrange bg-warmBeige shadow-[2px_2px_5px_rgba(53,92,69,0.1),-2px_-2px_5px_rgba(255,255,255,0.8)] hover:bg-burntOrange/10 active:shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1)] transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <XCircle className="w-4 h-4" />
                            <span>Cancel Session</span>
                        </button>
                    )}
                </div>

                {/* Cancelled Alert Banner */}
                {isCancelled && (
                    <div className="p-4 rounded-2xl bg-warmBeige text-forest border border-burntOrange/30 shadow-[inset_2px_2px_4px_rgba(201,120,75,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-burntOrange flex-shrink-0 mt-0.5" />
                        <div className="space-y-0.5 text-xs font-medium">
                            <p className="font-bold text-forest text-sm">
                                Session Cancelled
                            </p>
                            <p className="text-forest/75 leading-relaxed">
                                {isOwnerPractitioner
                                    ? "You have cancelled this therapy session. It is no longer bookable by clients."
                                    : "This therapy session was cancelled by the practitioner. If you had booked this slot, it has been moved to your Cancelled Bookings history."}
                            </p>
                        </div>
                    </div>
                )}

                {/* Success feedback if just cancelled */}
                {cancelMessage && !isCancelled && (
                    <div className="p-4 rounded-2xl bg-warmBeige text-forest border border-forest/30 shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] flex items-center gap-2 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-forest" />
                        <span>{cancelMessage}</span>
                    </div>
                )}

                {/* Session Hero Card */}
                <ClayCard level="2" className="p-6 sm:p-8 space-y-5 relative overflow-hidden">
                    <div className="flex items-center justify-between pb-3 border-b border-forest/10">
                        <div className="flex items-center gap-2">
                            <span className="font-bitcount text-burntOrange text-xs font-bold uppercase tracking-wider">
                                THERAPY SESSION
                            </span>
                        </div>

                        <ClayBadge
                            status={
                                isAvailable
                                    ? "forest"
                                    : isBooked
                                      ? "approved"
                                      : isCancelled
                                        ? "rejected"
                                        : "neutral"
                            }
                            size="md"
                        >
                            {session.status}
                        </ClayBadge>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-forest">
                            {session.title}
                        </h1>

                        <p className="text-xs sm:text-sm font-bold text-burntOrange capitalize">
                            Specialization: {session.specialization}
                        </p>

                        <p className="text-sm text-forest/80 font-medium leading-relaxed pt-1">
                            {session.description ||
                                "Holistic therapeutic session dedicated to healing and patient well-being."}
                        </p>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-2xl bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] border border-white/40">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60 block mb-1">
                                Schedule Time
                            </span>
                            <p className="text-sm font-bold text-forest">
                                {formatDateTime(session.startAt)}
                            </p>
                            <p className="text-xs font-bold text-burntOrange mt-0.5">
                                {formatTimeRange(session.startAt, session.endAt)} ({session.duration} min)
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] border border-white/40">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60 block mb-1">
                                Practitioner
                            </span>
                            <p className="text-sm font-bold text-forest">
                                Dr. {session.practitioner?.username || session.practitioner?.email}
                            </p>
                            <p className="text-xs font-semibold text-forest/70 mt-0.5">
                                {session.practitioner?.email}
                            </p>
                        </div>
                    </div>

                    {/* Book Now Button if Available (Non-Practitioner) */}
                    {isAvailable && !isOwnerPractitioner && (
                        <div className="pt-2">
                            <Link to={`/sessions/${session._id}/book`}>
                                <ClayButton
                                    variant="forest"
                                    size="lg"
                                    icon={Sparkles}
                                >
                                    Book This Session
                                </ClayButton>
                            </Link>
                        </div>
                    )}
                </ClayCard>

                {/* Booking Context Section (Visible if session has booking and user is authorized) */}
                {session.booking && (
                    <ClayCard
                        level="2"
                        className={`p-6 sm:p-7 space-y-4 border-l-4 ${
                            session.booking.status === "cancelled"
                                ? "border-l-burntOrange"
                                : "border-l-forest"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {session.booking.status === "cancelled" ? (
                                    <XCircle className="w-5 h-5 text-burntOrange" />
                                ) : (
                                    <CheckCircle2 className="w-5 h-5 text-forest" />
                                )}
                                <h2 className="text-lg font-bold text-forest">
                                    {session.booking.status === "cancelled"
                                        ? "Booking History (Cancelled)"
                                        : "Confirmed Booking Details"}
                                </h2>
                            </div>

                            <ClayBadge
                                status={
                                    session.booking.status === "confirmed"
                                        ? "approved"
                                        : session.booking.status === "cancelled"
                                          ? "rejected"
                                          : "neutral"
                                }
                                size="sm"
                            >
                                {session.booking.status}
                            </ClayBadge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-3.5 rounded-2xl bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] border border-white/40">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60 block mb-1">
                                    Patient / Client
                                </span>
                                <p className="text-xs font-bold text-forest">
                                    {session.booking.user?.username || session.booking.user?.email || "Patient"}
                                </p>
                                <p className="text-xs text-forest/70">
                                    {session.booking.user?.email}
                                </p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] border border-white/40">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60 block mb-1">
                                    Appointment Status
                                </span>
                                <p className="text-xs font-bold text-forest capitalize">
                                    {session.booking.status === "confirmed"
                                        ? "Confirmed & Reserved"
                                        : "Cancelled"}
                                </p>
                            </div>
                        </div>

                        {session.booking.bookingNotes && (
                            <div className="p-3.5 rounded-2xl bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] border border-white/40">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60 block mb-1">
                                    Client Notes
                                </span>
                                <p className="text-xs font-medium text-forest/80 leading-relaxed">
                                    {session.booking.bookingNotes}
                                </p>
                            </div>
                        )}
                    </ClayCard>
                )}

                {/* Practitioner Cancel Session Confirmation Modal */}
                {cancelModalOpen && (
                    <ClayModal
                        isOpen={cancelModalOpen}
                        onClose={() => setCancelModalOpen(false)}
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
                                    {session.title}
                                </p>
                                <p className="text-forest/70 mt-0.5">
                                    {formatDateTime(session.startAt)} · {formatTimeRange(session.startAt, session.endAt)}
                                </p>
                                {isBooked && (
                                    <p className="text-burntOrange font-bold mt-1">
                                        • Booked client: {session.booking?.user?.username || session.booking?.user?.email || "Patient"}
                                    </p>
                                )}
                            </div>

                            <div className="pt-2 flex gap-3">
                                <ClayButton
                                    variant="beige"
                                    size="md"
                                    fullWidth
                                    disabled={cancelLoading}
                                    onClick={() => setCancelModalOpen(false)}
                                >
                                    Keep Session
                                </ClayButton>

                                <ClayButton
                                    variant="danger"
                                    size="md"
                                    fullWidth
                                    loading={cancelLoading}
                                    onClick={handleConfirmCancellation}
                                    icon={XCircle}
                                >
                                    Cancel Session
                                </ClayButton>
                            </div>
                        </div>
                    </ClayModal>
                )}
            </main>
        </div>
    );
};

export default SessionDetailPage;
