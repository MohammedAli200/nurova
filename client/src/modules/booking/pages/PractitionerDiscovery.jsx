import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayButton from "../../../components/ui/ClayButton";
import ClayInput from "../../../components/ui/ClayInput";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayEmptyState from "../../../components/ui/ClayEmptyState";
import ClayErrorState from "../../../components/ui/ClayErrorState";
import {
    Search,
    Stethoscope,
    ShieldCheck,
    Calendar,
    Sparkles,
    ArrowRight,
} from "lucide-react";
import { getVerifiedPractitioners } from "../services/bookingService";

const specializations = [
    { label: "All Therapies", value: "" },
    { label: "Physiotherapy", value: "physiotherapy" },
    { label: "Acupuncture", value: "acupuncture" },
    { label: "Ayurveda", value: "Ayurveda" },
    { label: "Chiropractic", value: "chiropractic" },
];

const PractitionerDiscovery = () => {
    const [practitioners, setPractitioners] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpec, setSelectedSpec] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPractitioners = async () => {
        try {
            setLoading(true);
            setError("");
            const result = await getVerifiedPractitioners({
                search: searchTerm || undefined,
                specialization: selectedSpec || undefined,
            });

            setPractitioners(result.practitioners || []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to load practitioner directory."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPractitioners();
    }, [selectedSpec]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadPractitioners();
    };

    return (
        <div className="min-h-screen bg-sand font-georama pb-12">
            <UserNavbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 animate-page-entrance">
                {/* Header Banner */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bitcount text-burntOrange text-xs sm:text-sm tracking-widest uppercase font-bold">
                            WELLNESS NETWORK
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-forest tracking-tight">
                        Discover Practitioners
                    </h1>

                    <p className="text-forest/70 mt-1.5 text-sm sm:text-base font-medium max-w-2xl">
                        Explore certified holistic healthcare providers, review therapeutic specializations, and book personalized sessions.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <ClayCard level="2" className="p-4 sm:p-5 space-y-4 border border-white/60">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-col sm:flex-row items-center gap-3"
                    >
                        <div className="flex-1 w-full">
                            <ClayInput
                                type="text"
                                placeholder="Search by practitioner name or clinical focus..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={Search}
                            />
                        </div>

                        <div className="w-full sm:w-auto flex-shrink-0">
                            <ClayButton
                                type="submit"
                                variant="forest"
                                size="md"
                                fullWidth={false}
                                icon={Search}
                            >
                                Search
                            </ClayButton>
                        </div>
                    </form>

                    {/* Specialization Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
                        {specializations.map((spec) => (
                            <button
                                key={spec.value}
                                type="button"
                                onClick={() => setSelectedSpec(spec.value)}
                                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 ${
                                    selectedSpec === spec.value
                                        ? "clay-btn-forest text-sand !shadow-[3px_3px_8px_rgba(53,92,69,0.25)] !transform-none"
                                        : "text-forest/70 hover:text-forest bg-warmBeige shadow-[2px_2px_4px_rgba(53,92,69,0.06),-2px_-2px_4px_rgba(255,255,255,0.7)] hover:bg-white/40"
                                }`}
                            >
                                {spec.label}
                            </button>
                        ))}
                    </div>
                </ClayCard>

                {/* Error Banner */}
                {error && (
                    <ClayErrorState
                        title="Unable to Load Practitioners"
                        message={error}
                        onRetry={loadPractitioners}
                    />
                )}

                {/* Practitioners Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <ClayCard key={i} level="2" className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <ClaySkeleton className="h-14 w-14 rounded-3xl" />
                                    <ClaySkeleton className="h-5 w-20" />
                                </div>
                                <ClaySkeleton className="h-5 w-36" />
                                <ClaySkeleton className="h-4 w-full" />
                                <ClaySkeleton className="h-4 w-4/5" />
                                <ClaySkeleton className="h-10 w-full rounded-xl mt-4" />
                            </ClayCard>
                        ))}
                    </div>
                ) : !practitioners.length ? (
                    <ClayEmptyState
                        icon={Stethoscope}
                        title="No Verified Practitioners Found"
                        description="There are no approved practitioners matching your search terms or filter."
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {practitioners.map((p) => {
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
                                    className="p-6 sm:p-7 flex flex-col justify-between group hover:shadow-clay-card-hover transition-all duration-300 border border-white/60 hover:border-forest/20"
                                >
                                    <div className="space-y-3.5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="w-14 h-14 rounded-3xl bg-forest text-sand flex items-center justify-center text-xl font-extrabold shadow-[3px_3px_8px_rgba(53,92,69,0.25)] group-hover:scale-105 group-hover:shadow-[4px_4px_12px_rgba(53,92,69,0.35)] transition-all duration-300">
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
                                            <h3 className="text-lg font-bold text-forest group-hover:text-burntOrange transition-colors">
                                                {p.username || p.email}
                                            </h3>
                                            <p className="text-xs font-bold text-burntOrange capitalize mt-0.5">
                                                {p.specialization || "Holistic Care"}
                                            </p>
                                        </div>

                                        <p className="text-xs text-forest/75 leading-relaxed font-medium line-clamp-3">
                                            {p.bio || "Certified healthcare practitioner focused on holistic wellness, patient education, and natural treatments."}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-forest/10 flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-forest/65">
                                            {p.availableSessionCount || 0} session
                                            {p.availableSessionCount !== 1 ? "s" : ""} available
                                        </span>

                                        <Link to={`/practitioners/${p._id}`}>
                                            <ClayButton
                                                variant="forest"
                                                size="sm"
                                                fullWidth={false}
                                                icon={ArrowRight}
                                                iconPosition="right"
                                            >
                                                View Profile
                                            </ClayButton>
                                        </Link>
                                    </div>
                                </ClayCard>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default PractitionerDiscovery;
