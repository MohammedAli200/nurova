import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayButton from "../../../components/ui/ClayButton";
import ClayInput from "../../../components/ui/ClayInput";
import ClayTextarea from "../../../components/ui/ClayTextarea";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayErrorState from "../../../components/ui/ClayErrorState";
import {
    Calendar,
    Clock,
    User,
    Mail,
    Stethoscope,
    ShieldCheck,
    CheckCircle2,
    ArrowLeft,
    AlertCircle,
    Sparkles,
} from "lucide-react";
import { getSessionById, bookSession } from "../services/bookingService";

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();

    const [session, setSession] = useState(null);
    const [bookingNotes, setBookingNotes] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    const loadSession = async () => {
        try {
            setLoading(true);
            setError("");
            const result = await getSessionById(id);

            if (result.session.status !== "available") {
                setError(
                    "This therapy session is no longer available for booking."
                );
            }

            setSession(result.session);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to retrieve session details."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSession();
    }, [id]);

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        setError("");

        if (!agreed) {
            const msg = "Please check the confirmation box before proceeding with your booking.";
            setError(msg);
            toast.warning(msg, "Action Required");
            return;
        }

        setSubmitting(true);

        try {
            const result = await bookSession(id, {
                bookingNotes: bookingNotes.trim(),
            });

            setConfirmedBooking(result.booking);
            toast.success(
                `Your appointment with Dr. ${session?.practitioner?.username || session?.practitioner?.email} is confirmed.`,
                "Booking Confirmed!"
            );
        } catch (err) {
            console.error("BOOKING ERROR:", err);
            const msg =
                err.response?.data?.message ||
                "This session was just booked by someone else. Please choose another available session.";
            setError(msg);
            toast.error(msg, "Booking Failed");
        } finally {
            setSubmitting(false);
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
                    <ClaySkeleton className="h-44 w-full rounded-3xl" />
                    <ClaySkeleton className="h-64 w-full rounded-3xl" />
                </main>
            </div>
        );
    }

    // Success Screen
    if (confirmedBooking) {
        return (
            <div className="min-h-screen bg-sand font-georama pb-12">
                <UserNavbar />

                <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 animate-page-entrance">
                    <ClayCard level="3" className="text-center p-8 sm:p-10 space-y-6 border-2 border-white/80 shadow-2xl relative overflow-hidden">
                        {/* Subtle decorative glow */}
                        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-forest/8 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-burntOrange/8 blur-3xl pointer-events-none" />

                        <div className="w-18 h-18 rounded-3xl bg-forest text-sand flex items-center justify-center mx-auto shadow-[4px_4px_16px_rgba(53,92,69,0.35)] animate-scale-pop relative z-10">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>

                        <div className="space-y-2 relative z-10">
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] text-xs font-bold text-burntOrange border border-white/40">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>CONFIRMED APPOINTMENT</span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-forest">
                                Your Therapy Session is Confirmed!
                            </h1>

                            <p className="text-sm text-forest/75 max-w-md mx-auto font-medium">
                                A confirmation has been registered for your therapy session with Dr.{" "}
                                {session?.practitioner?.username || session?.practitioner?.email}.
                            </p>
                        </div>

                        {/* Confirmation Overview Box */}
                        <div className="p-5 rounded-2xl bg-warmBeige shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/50 text-left space-y-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60">
                                    Therapy Title
                                </span>
                                <p className="text-base font-bold text-forest">
                                    {session?.title}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-forest/80">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60 block">
                                        Date & Time
                                    </span>
                                    <span>{formatDateTime(session?.startAt)}</span>
                                    <span className="block text-burntOrange font-bold">
                                        {formatTimeRange(session?.startAt, session?.endAt)}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60 block">
                                        Practitioner
                                    </span>
                                    <span>
                                        {session?.practitioner?.username || session?.practitioner?.email}
                                    </span>
                                    <span className="block capitalize text-forest/60">
                                        {session?.specialization}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <Link to={`/sessions/${session?._id}`} className="w-full sm:w-auto">
                                <ClayButton
                                    variant="forest"
                                    size="md"
                                    fullWidth
                                    icon={Sparkles}
                                >
                                    View Session Details
                                </ClayButton>
                            </Link>

                            <Link to="/my-bookings" className="w-full sm:w-auto">
                                <ClayButton
                                    variant="beige"
                                    size="md"
                                    fullWidth
                                >
                                    Go to My Bookings
                                </ClayButton>
                            </Link>
                        </div>
                    </ClayCard>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sand font-georama pb-12">
            <UserNavbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
                {/* Back button */}
                <div>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-forest/70 hover:text-burntOrange transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>
                </div>

                {/* Session Summary Card */}
                <ClayCard level="2" className="p-6 sm:p-7 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-forest/10">
                        <div className="flex items-center gap-2">
                            <span className="font-bitcount text-burntOrange text-xs font-bold uppercase tracking-wider">
                                SESSION DOSSIER
                            </span>
                        </div>

                        <ClayBadge status="approved" size="sm">
                            Single Capacity Slot
                        </ClayBadge>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-extrabold text-forest">
                            {session?.title}
                        </h1>

                        <p className="text-xs sm:text-sm text-forest/75 font-medium leading-relaxed">
                            {session?.description ||
                                "Personalized restorative therapy consultation with a certified practitioner."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3.5 rounded-2xl bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] border border-white/40">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60 block mb-1">
                                Appointment Time
                            </span>
                            <p className="text-xs font-bold text-forest">
                                {formatDateTime(session?.startAt)}
                            </p>
                            <p className="text-xs font-bold text-burntOrange mt-0.5">
                                {formatTimeRange(session?.startAt, session?.endAt)} ({session?.duration} min)
                            </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] border border-white/40">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60 block mb-1">
                                Specialist
                            </span>
                            <p className="text-xs font-bold text-forest">
                                Dr. {session?.practitioner?.username || session?.practitioner?.email}
                            </p>
                            <p className="text-xs font-semibold text-forest/70 capitalize mt-0.5">
                                Specialization: {session?.specialization}
                            </p>
                        </div>
                    </div>
                </ClayCard>

                {/* Booking Form Card */}
                <ClayCard level="2" className="p-6 sm:p-7">
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-forest">
                            Confirm Your Client Details
                        </h2>
                        <p className="text-xs text-forest/70 font-medium mt-0.5">
                            Please review your details and confirm reservation for this appointment.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 p-3.5 rounded-2xl bg-warmBeige text-burntOrange border border-burntOrange/30 shadow-[inset_2px_2px_4px_rgba(201,120,75,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] flex items-start gap-2.5 text-xs font-semibold">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleConfirmBooking} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ClayInput
                                label="Your Name / Username"
                                value={user?.username || user?.email?.split("@")[0] || ""}
                                disabled
                                icon={User}
                            />

                            <ClayInput
                                label="Contact Email"
                                value={user?.email || ""}
                                disabled
                                icon={Mail}
                            />
                        </div>

                        <ClayTextarea
                            label="Therapy Notes for Practitioner (Optional)"
                            placeholder="Share any existing injuries, physical conditions, or specific focus areas you would like addressed..."
                            value={bookingNotes}
                            onChange={(e) => setBookingNotes(e.target.value)}
                            rows={3}
                        />

                        {/* Confirmation Checkbox */}
                        <div className="p-4 rounded-2xl bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] border border-white/40 flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="booking-agreed"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-forest focus:ring-forest cursor-pointer"
                                required
                            />
                            <label
                                htmlFor="booking-agreed"
                                className="text-xs font-semibold text-forest/80 cursor-pointer select-none leading-relaxed"
                            >
                                I confirm my appointment for this single-capacity session and understand this slot will be exclusively reserved for me.
                            </label>
                        </div>

                        <div className="pt-2">
                            <ClayButton
                                type="submit"
                                variant="forest"
                                size="lg"
                                loading={submitting}
                                disabled={session?.status !== "available" || !agreed}
                                icon={Sparkles}
                            >
                                Confirm Booking
                            </ClayButton>
                        </div>
                    </form>
                </ClayCard>
            </main>
        </div>
    );
};

export default BookingPage;
