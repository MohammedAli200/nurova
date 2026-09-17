import React, { useEffect, useState } from "react";
import { Search, Filter, RefreshCw, Stethoscope, AlertCircle } from "lucide-react";
import PractitionerTable from "../components/PractitionerTable";
import PractitionerDetails from "../components/PractitionerDetails";
import ApprovalModal from "../components/ApprovalModal";
import ClayCard from "../../../components/ui/ClayCard";
import ClayInput from "../../../components/ui/ClayInput";
import ClaySelect from "../../../components/ui/ClaySelect";
import ClayButton from "../../../components/ui/ClayButton";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayErrorState from "../../../components/ui/ClayErrorState";
import { useToast } from "../../../contexts/ToastContext";
import {
    getPractitioners,
    getPractitioner,
    approvePractitioner,
    rejectPractitioner,
} from "../services/adminService";

const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "pending", label: "Pending Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
];

const Practitioners = () => {
    const toast = useToast();
    const [practitioners, setPractitioners] = useState([]);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedPractitioner, setSelectedPractitioner] = useState(null);
    const [action, setAction] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadPractitioners = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getPractitioners({
                status: status || undefined,
                search: search || undefined,
            });

            setPractitioners(result.practitioners || []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to load practitioner records."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPractitioners();
    }, [status]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadPractitioners();
    };

    const handleView = async (practitioner) => {
        try {
            const result = await getPractitioner(practitioner._id);
            setSelectedPractitioner(result.practitioner);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load practitioner details."
            );
        }
    };

    const handleAction = (practitioner, actionType) => {
        setSelectedPractitioner(practitioner);
        setAction(actionType);
    };

    const confirmAction = async () => {
        if (!selectedPractitioner || !action) return;

        try {
            setActionLoading(true);

            if (action === "approve") {
                await approvePractitioner(selectedPractitioner._id);
                toast.success(
                    `Dr. ${selectedPractitioner.username || selectedPractitioner.email} has been approved.`,
                    "Practitioner Approved"
                );
            } else {
                await rejectPractitioner(selectedPractitioner._id);
                toast.warning(
                    `Application for Dr. ${selectedPractitioner.username || selectedPractitioner.email} has been rejected.`,
                    "Application Rejected"
                );
            }

            setAction(null);
            setSelectedPractitioner(null);
            await loadPractitioners();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update practitioner status.";
            setError(msg);
            toast.error(msg, "Action Failed");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6 font-georama animate-page-entrance">
            {/* Header Section */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bitcount text-burntOrange text-xs sm:text-sm tracking-widest uppercase font-bold">
                        PRACTITIONER MANAGEMENT
                    </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-forest tracking-tight">
                    Practitioners
                </h1>

                <p className="text-forest/70 mt-1.5 text-sm font-medium">
                    Review incoming credentials, verify medical documentation, and manage statuses.
                </p>
            </div>

            {/* Error Banner if any */}
            {error && (
                <div className="p-4 rounded-2xl bg-warmBeige text-burntOrange border border-burntOrange/30 shadow-[inset_2px_2px_4px_rgba(201,120,75,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] flex items-center justify-between gap-3 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                    <button
                        type="button"
                        onClick={loadPractitioners}
                        className="underline hover:text-forest"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Search and Filters Toolbar */}
            <ClayCard level="2" className="p-4 sm:p-5">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col sm:flex-row items-center gap-3"
                >
                    <div className="flex-1 w-full">
                        <ClayInput
                            type="text"
                            placeholder="Search by practitioner email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={Search}
                        />
                    </div>

                    <div className="w-full sm:w-56">
                        <ClaySelect
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            options={statusOptions}
                        />
                    </div>

                    <div className="w-full sm:w-auto">
                        <ClayButton
                            type="submit"
                            variant="forest"
                            size="md"
                            icon={Search}
                            fullWidth={false}
                        >
                            Search
                        </ClayButton>
                    </div>
                </form>
            </ClayCard>

            {/* Practitioners Data Table or Loading Skeletons */}
            {loading ? (
                <div className="clay-surface-2 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <ClaySkeleton className="h-6 w-36" />
                        <ClaySkeleton className="h-6 w-24" />
                    </div>
                    {[1, 2, 3, 4].map((i) => (
                        <ClaySkeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            ) : (
                <PractitionerTable
                    practitioners={practitioners}
                    onView={handleView}
                    onApprove={(p) => handleAction(p, "approve")}
                    onReject={(p) => handleAction(p, "reject")}
                />
            )}

            {/* Confirmation Decision Modal */}
            {action && (
                <ApprovalModal
                    practitioner={selectedPractitioner}
                    action={action}
                    loading={actionLoading}
                    onConfirm={confirmAction}
                    onCancel={() => {
                        setAction(null);
                        setSelectedPractitioner(null);
                    }}
                />
            )}

            {/* Practitioner Full Details Modal */}
            {selectedPractitioner && !action && (
                <PractitionerDetails
                    practitioner={selectedPractitioner}
                    onClose={() => setSelectedPractitioner(null)}
                />
            )}
        </div>
    );
};

export default Practitioners;