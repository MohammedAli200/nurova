import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Calendar,
    Clock,
    User,
    Mail,
    FileText,
    Stethoscope,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayButton from "../../../components/ui/ClayButton";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayEmptyState from "../../../components/ui/ClayEmptyState";
import ClayErrorState from "../../../components/ui/ClayErrorState";
import { getPractitionerBookings } from "../../booking/services/bookingService";

const PractitionerBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");
            const result = await getPractitionerBookings({
                status: statusFilter || undefined,
            });
            setBookings(result.bookings || []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to retrieve client bookings."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, [statusFilter]);

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

            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 animate-page-entrance">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bitcount text-burntOrange text-xs sm:text-sm tracking-widest uppercase font-bold">
                                CLIENT MANAGEMENT
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest tracking-tight">
                            Client Bookings
                        </h1>
                        <p className="text-forest/70 mt-1 text-sm font-medium">
                            Review appointments booked by clients, notes, and session details.
                        </p>
                    </div>

                    <Link to="/practitioner">
                        <ClayButton
                            variant="beige"
                            size="md"
                            fullWidth={false}
                        >
                            Back to Workspace
                        </ClayButton>
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {[
                        { label: "All Bookings", value: "" },
                        { label: "Confirmed", value: "confirmed" },
                        { label: "Cancelled", value: "cancelled" },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setStatusFilter(tab.value)}
                            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                statusFilter === tab.value
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

                {/* Bookings List / Skeletons */}
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
                ) : !bookings.length ? (
                    <ClayEmptyState
                        icon={Calendar}
                        title="No Client Bookings Found"
                        description="You do not have any client bookings matching this status."
                    />
                ) : (
                    <div className="space-y-4">
                        {bookings.map((b) => {
                            const clientInitial = (
                                b.user?.username?.[0] ||
                                b.user?.email?.[0] ||
                                "U"
                            ).toUpperCase();

                            return (
                                <ClayCard
                                    key={b._id}
                                    level="2"
                                    className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:shadow-clay-card-hover transition-all"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-2xl bg-forest text-sand flex items-center justify-center text-lg font-bold shadow-[2px_2px_5px_rgba(53,92,69,0.2)] flex-shrink-0">
                                            {clientInitial}
                                        </div>

                                        <div className="space-y-1 flex-1 min-w-0">
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

                                            <div className="flex items-center gap-4 text-xs font-semibold text-forest/70 flex-wrap">
                                                <span className="flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-burntOrange" />
                                                    {b.user?.username || "Client"}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-forest/50" />
                                                    {b.user?.email}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-forest/50" />
                                                    {formatDateTime(b.session?.startAt)}
                                                </span>
                                            </div>

                                            {b.bookingNotes && (
                                                <p className="text-xs text-forest/75 bg-warmBeige p-2.5 rounded-xl shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.8)] border border-white/30 mt-2">
                                                    <span className="font-bold text-forest">Client Notes:</span>{" "}
                                                    {b.bookingNotes}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {b.session?._id && (
                                        <div className="flex-shrink-0 self-end md:self-center">
                                            <Link to={`/sessions/${b.session._id}`}>
                                                <ClayButton
                                                    variant="forest"
                                                    size="sm"
                                                    fullWidth={false}
                                                    icon={ArrowRight}
                                                >
                                                    Session Details
                                                </ClayButton>
                                            </Link>
                                        </div>
                                    )}
                                </ClayCard>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default PractitionerBookingsPage;
