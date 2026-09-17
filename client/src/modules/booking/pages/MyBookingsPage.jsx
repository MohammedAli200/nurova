import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayButton from "../../../components/ui/ClayButton";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayEmptyState from "../../../components/ui/ClayEmptyState";
import ClayErrorState from "../../../components/ui/ClayErrorState";
import ClayModal from "../../../components/ui/ClayModal";
import { useToast } from "../../../contexts/ToastContext";
import {
    Calendar,
    Clock,
    User,
    Stethoscope,
    ArrowRight,
    XCircle,
    CheckCircle2,
    Sparkles,
} from "lucide-react";
import { getUserBookings, cancelUserBooking } from "../services/bookingService";

const MyBookingsPage = () => {
    const toast = useToast();
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState("upcoming");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingBooking, setCancellingBooking] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");
            const result = await getUserBookings();
            setBookings(result.bookings || []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Failed to load your bookings."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const now = new Date();

    // Filter bookings based on active tab
    const filteredBookings = bookings.filter((b) => {
        if (!b.session) return false;
        const sessionDate = new Date(b.session.startAt);

        if (activeTab === "upcoming") {
            return b.status === "confirmed" && sessionDate > now;
        }
        if (activeTab === "past") {
            return (
                (b.status === "confirmed" && sessionDate <= now) ||
                b.status === "completed"
            );
        }
        if (activeTab === "cancelled") {
            return b.status === "cancelled";
        }
        return true;
    });

    const handleConfirmCancel = async () => {
        if (!cancellingBooking) return;

        try {
            setCancelLoading(true);
            await cancelUserBooking(cancellingBooking._id);
            toast.success("Your appointment booking has been cancelled.", "Booking Cancelled");
            setCancellingBooking(null);
            await loadBookings();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Failed to cancel booking.";
            setError(msg);
            toast.error(msg, "Cancellation Failed");
        } finally {
            setCancelLoading(false);
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-sand font-georama pb-12">
            <UserNavbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 animate-page-entrance">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bitcount text-burntOrange text-xs sm:text-sm tracking-widest uppercase font-bold">
                                MY WELLNESS
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest tracking-tight">
                            My Bookings
                        </h1>
                        <p className="text-forest/70 mt-1 text-sm font-medium">
                            Manage your scheduled appointments and therapeutic history.
                        </p>
                    </div>

                    <Link to="/practitioners">
                        <ClayButton
                            variant="forest"
                            size="md"
                            fullWidth={false}
                            icon={Sparkles}
                        >
                            Book New Therapy
                        </ClayButton>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                        { label: "Upcoming", value: "upcoming" },
                        { label: "Past Sessions", value: "past" },
                        { label: "Cancelled", value: "cancelled" },
                        { label: "All History", value: "all" },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setActiveTab(tab.value)}
                            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === tab.value
                                    ? "clay-btn-forest text-sand !shadow-[3px_3px_8px_rgba(53,92,69,0.25)] !transform-none"
                                    : "text-forest/70 hover:text-forest bg-warmBeige shadow-[2px_2px_4px_rgba(53,92,69,0.06),-2px_-2px_4px_rgba(255,255,255,0.7)]"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Error Banner */}
                {error && (
                    <ClayErrorState
                        title="Failed to Load Bookings"
                        message={error}
                        onRetry={loadBookings}
                    />
                )}

                {/* Bookings List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <ClayCard key={i} level="2" className="p-6 space-y-3">
                                <div className="flex justify-between">
                                    <ClaySkeleton className="h-6 w-48" />
                                    <ClaySkeleton className="h-6 w-24" />
                                </div>
                                <ClaySkeleton className="h-4 w-72" />
                                <ClaySkeleton className="h-4 w-96" />
                            </ClayCard>
                        ))}
                    </div>
                ) : !filteredBookings.length ? (
                    <ClayEmptyState
                        icon={Calendar}
                        title="No Therapy Sessions Found"
                        description={
                            activeTab === "upcoming"
                                ? "You don't have any upcoming therapy sessions scheduled. Browse verified practitioners to book your next session."
                                : "No booking history matching this tab."
                        }
                        actionLabel={
                            activeTab === "upcoming" ? "Find Practitioner" : null
                        }
                        onAction={() => {}}
                    />
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((b) => {
                            const practitionerInitial = (
                                b.practitioner?.username?.[0] ||
                                b.practitioner?.email?.[0] ||
                                "P"
                            ).toUpperCase();

                            const isUpcoming =
                                b.status === "confirmed" &&
                                new Date(b.session?.startAt) > now;

                            return (
                                <ClayCard
                                    key={b._id}
                                    level="2"
                                    className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:shadow-clay-card-hover transition-all"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-2xl bg-forest text-sand flex items-center justify-center text-lg font-bold shadow-[2px_2px_5px_rgba(53,92,69,0.2)] flex-shrink-0">
                                            {practitionerInitial}
                                        </div>

                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <h3 className="text-base sm:text-lg font-bold text-forest truncate">
                                                    {b.session?.title || "Therapy Session"}
                                                </h3>
                                                <ClayBadge
                                                    status={
                                                        b.status === "confirmed"
                                                            ? "approved"
                                                            : b.status === "cancelled"
                                                              ? "rejected"
                                                              : "neutral"
                                                    }
                                                    size="sm"
                                                >
                                                    {b.status}
                                                </ClayBadge>
                                            </div>

                                            <p className="text-xs font-semibold text-forest/70 flex items-center gap-3 flex-wrap">
                                                <span>
                                                    Dr.{" "}
                                                    {b.practitioner?.username ||
                                                        b.practitioner?.email}
                                                </span>
                                                <span>•</span>
                                                <span className="capitalize text-burntOrange font-bold">
                                                    {b.session?.specialization}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 text-forest/80 font-bold">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatDateTime(b.session?.startAt)}
                                                </span>
                                            </p>

                                            {b.bookingNotes && (
                                                <p className="text-xs text-forest/75 bg-warmBeige p-2 rounded-xl shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.8)] border border-white/30 max-w-lg mt-1">
                                                    <span className="font-bold text-forest">Notes:</span>{" "}
                                                    {b.bookingNotes}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 flex-shrink-0 self-end md:self-center">
                                        {isUpcoming && (
                                            <button
                                                type="button"
                                                onClick={() => setCancellingBooking(b)}
                                                className="px-3 py-2 rounded-xl text-xs font-bold text-burntOrange bg-warmBeige shadow-[2px_2px_4px_rgba(53,92,69,0.1),-2px_-2px_4px_rgba(255,255,255,0.8)] hover:bg-burntOrange/10 active:shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1)] transition-all cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        )}

                                        <Link to={`/sessions/${b.session?._id}`}>
                                            <ClayButton
                                                variant="forest"
                                                size="sm"
                                                fullWidth={false}
                                                icon={ArrowRight}
                                            >
                                                Details
                                            </ClayButton>
                                        </Link>
                                    </div>
                                </ClayCard>
                            );
                        })}
                    </div>
                )}

                {/* Cancel Booking Confirmation Modal */}
                {cancellingBooking && (
                    <ClayModal
                        isOpen={!!cancellingBooking}
                        onClose={() => setCancellingBooking(null)}
                        subtitle="BOOKING CANCELLATION"
                        title="Cancel Therapy Appointment?"
                        maxWidth="max-w-md"
                    >
                        <div className="space-y-4 font-georama text-left">
                            <p className="text-sm font-medium text-forest/80 leading-relaxed">
                                Are you sure you want to cancel your appointment for{" "}
                                <span className="font-bold text-forest">
                                    {cancellingBooking.session?.title}
                                </span>
                                ? The reserved session will be made available for other clients.
                            </p>

                            <div className="pt-2 flex gap-3">
                                <ClayButton
                                    variant="beige"
                                    size="md"
                                    fullWidth
                                    disabled={cancelLoading}
                                    onClick={() => setCancellingBooking(null)}
                                >
                                    Keep Appointment
                                </ClayButton>

                                <ClayButton
                                    variant="orange"
                                    size="md"
                                    fullWidth
                                    loading={cancelLoading}
                                    onClick={handleConfirmCancel}
                                >
                                    Confirm Cancel
                                </ClayButton>
                            </div>
                        </div>
                    </ClayModal>
                )}
            </main>
        </div>
    );
};

export default MyBookingsPage;
