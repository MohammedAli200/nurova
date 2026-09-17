import React from "react";
import { Eye, Check, X, Stethoscope, Mail, ShieldAlert } from "lucide-react";
import ClayCard from "../../../components/ui/ClayCard";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayEmptyState from "../../../components/ui/ClayEmptyState";

/**
 * PractitionerTable Component
 * Tactile table for viewing, approving, and rejecting practitioner applications.
 */
const PractitionerTable = ({
    practitioners = [],
    onView,
    onApprove,
    onReject,
}) => {
    if (!practitioners.length) {
        return (
            <ClayEmptyState
                icon={Stethoscope}
                title="No Practitioners Found"
                description="No practitioner records match your search criteria or status filter."
            />
        );
    }

    return (
        <ClayCard level="2" className="p-0 overflow-hidden font-georama">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-forest/10 bg-warmBeige/60">
                            <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-forest/70">
                                Email / Practitioner
                            </th>

                            <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-forest/70">
                                Specialization
                            </th>

                            <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-forest/70">
                                Verification Status
                            </th>

                            <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-forest/70 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-forest/10">
                        {practitioners.map((practitioner) => {
                            const status =
                                practitioner.approvalStatus ||
                                (practitioner.isApproved ? "approved" : "pending");

                            return (
                                <tr
                                    key={practitioner._id}
                                    className="hover:bg-white/30 transition-colors duration-150"
                                >
                                    {/* Email / Info */}
                                    <td className="p-4 sm:p-5 font-semibold text-forest text-sm">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-warmBeige flex items-center justify-center text-forest/70 shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] border border-white/40 flex-shrink-0">
                                                <Mail className="w-4 h-4 text-forest/70" />
                                            </div>
                                            <span className="truncate max-w-xs">{practitioner.email}</span>
                                        </div>
                                    </td>

                                    {/* Specialization */}
                                    <td className="p-4 sm:p-5 text-forest/80 text-sm font-medium capitalize">
                                        {practitioner.specialization || "General Care"}
                                    </td>

                                    {/* Status Badge */}
                                    <td className="p-4 sm:p-5">
                                        <ClayBadge
                                            status={status}
                                            size="sm"
                                        >
                                            {status}
                                        </ClayBadge>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4 sm:p-5 text-right">
                                        <div className="flex items-center justify-end gap-2 flex-wrap">
                                            {/* View Details Button */}
                                            <button
                                                type="button"
                                                onClick={() => onView(practitioner)}
                                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-forest bg-warmBeige shadow-[3px_3px_6px_rgba(53,92,69,0.1),-3px_-3px_6px_rgba(255,255,255,0.8)] hover:text-burntOrange hover:shadow-[1px_1px_3px_rgba(53,92,69,0.1),-1px_-1px_3px_rgba(255,255,255,0.8)] active:shadow-[inset_2px_2px_4px_rgba(53,92,69,0.12)] transition-all flex items-center gap-1.5"
                                                title="View practitioner credentials"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>View</span>
                                            </button>

                                            {/* Approve / Reject buttons if pending */}
                                            {status === "pending" && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => onApprove(practitioner)}
                                                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-sand clay-btn-forest flex items-center gap-1.5"
                                                        title="Approve practitioner"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>Approve</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => onReject(practitioner)}
                                                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-sand clay-btn-orange flex items-center gap-1.5"
                                                        title="Reject practitioner"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                        <span>Reject</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </ClayCard>
    );
};

export default PractitionerTable;