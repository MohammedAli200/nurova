import React from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import ClayModal from "../../../components/ui/ClayModal";
import ClayButton from "../../../components/ui/ClayButton";

const ApprovalModal = ({
    practitioner,
    action,
    loading,
    onConfirm,
    onCancel,
}) => {
    if (!practitioner || !action) return null;

    const approving = action === "approve";

    return (
        <ClayModal
            isOpen={!!practitioner && !!action}
            onClose={onCancel}
            subtitle="ADMIN DECISION"
            title={approving ? "Approve Practitioner Application?" : "Reject Practitioner Application?"}
            maxWidth="max-w-md"
        >
            <div className="space-y-4 font-georama text-left">
                <p className="text-sm font-medium text-forest/80 leading-relaxed">
                    {approving
                        ? "Are you sure you want to approve this practitioner? They will immediately receive practitioner privileges on the Nurova platform."
                        : "Are you sure you want to reject this practitioner? Their application status will be marked as rejected."}
                </p>

                {/* Candidate Overview Chip */}
                <div className="p-4 rounded-2xl bg-warmBeige shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/40">
                    <p className="font-bold text-forest text-sm truncate">
                        {practitioner.email}
                    </p>
                    <p className="text-xs font-semibold text-burntOrange capitalize mt-0.5">
                        Specialization: {practitioner.specialization || "General Care"}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-3">
                    <ClayButton
                        variant="beige"
                        size="md"
                        fullWidth
                        disabled={loading}
                        onClick={onCancel}
                    >
                        Cancel
                    </ClayButton>

                    <ClayButton
                        variant={approving ? "forest" : "orange"}
                        size="md"
                        fullWidth
                        loading={loading}
                        onClick={onConfirm}
                        icon={approving ? CheckCircle2 : XCircle}
                    >
                        {approving ? "Confirm Approval" : "Confirm Rejection"}
                    </ClayButton>
                </div>
            </div>
        </ClayModal>
    );
};

export default ApprovalModal;