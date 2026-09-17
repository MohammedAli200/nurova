import React from "react";
import { Mail, Stethoscope, ShieldCheck, FileText, ExternalLink, FileCheck } from "lucide-react";
import ClayModal from "../../../components/ui/ClayModal";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayButton from "../../../components/ui/ClayButton";

const PractitionerDetails = ({ practitioner, onClose }) => {
    if (!practitioner) return null;

    const documentUrl = practitioner.document?.filename
        ? `http://localhost:5001/uploads/practitioners/${practitioner.document.filename}`
        : null;

    const status = practitioner.approvalStatus || (practitioner.isApproved ? "approved" : "pending");

    return (
        <ClayModal
            isOpen={!!practitioner}
            onClose={onClose}
            subtitle="PRACTITIONER DOSSIER"
            title="Credential Details"
            maxWidth="max-w-2xl"
        >
            <div className="space-y-4 font-georama text-left">
                {/* Status Pill Card */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-warmBeige shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/40">
                    <span className="text-xs font-bold uppercase tracking-wider text-forest/70">
                        Current Application Status
                    </span>
                    <ClayBadge status={status} size="md">
                        {status}
                    </ClayBadge>
                </div>

                {/* Email and Specialization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-warmBeige shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/40">
                        <div className="flex items-center gap-1.5 text-forest/60 mb-1">
                            <Mail className="w-3.5 h-3.5 text-burntOrange" />
                            <span className="text-xs font-bold uppercase tracking-wider">
                                Email Address
                            </span>
                        </div>
                        <p className="text-sm font-bold text-forest truncate">
                            {practitioner.email}
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-warmBeige shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/40">
                        <div className="flex items-center gap-1.5 text-forest/60 mb-1">
                            <Stethoscope className="w-3.5 h-3.5 text-burntOrange" />
                            <span className="text-xs font-bold uppercase tracking-wider">
                                Specialization
                            </span>
                        </div>
                        <p className="text-sm font-bold text-forest capitalize">
                            {practitioner.specialization || "General Care"}
                        </p>
                    </div>
                </div>

                {/* Bio */}
                <div className="p-4 rounded-2xl bg-warmBeige shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/40">
                    <div className="flex items-center gap-1.5 text-forest/60 mb-1">
                        <FileText className="w-3.5 h-3.5 text-burntOrange" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            Professional Statement / Bio
                        </span>
                    </div>
                    <p className="text-sm font-medium text-forest/80 leading-relaxed">
                        {practitioner.bio || "No biography submitted with this application."}
                    </p>
                </div>

                {/* Uploaded Verification Document */}
                <div className="p-4 rounded-2xl bg-warmBeige shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/40">
                    <div className="flex items-center gap-1.5 text-forest/60 mb-2">
                        <FileCheck className="w-3.5 h-3.5 text-burntOrange" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            Uploaded Licensing Document
                        </span>
                    </div>

                    {documentUrl ? (
                        <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-warmBeige shadow-[2px_2px_5px_rgba(53,92,69,0.08),-2px_-2px_5px_rgba(255,255,255,0.8)] border border-white/50">
                            <div className="truncate">
                                <p className="text-xs font-bold text-forest truncate">
                                    {practitioner.document?.filename || "License_Document"}
                                </p>
                                <p className="text-[11px] text-forest/50">
                                    Uploaded Document
                                </p>
                            </div>

                            <a
                                href={documentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-shrink-0"
                            >
                                <ClayButton
                                    variant="forest"
                                    size="sm"
                                    fullWidth={false}
                                    icon={ExternalLink}
                                >
                                    Open File
                                </ClayButton>
                            </a>
                        </div>
                    ) : (
                        <p className="text-xs text-forest/60 font-medium">
                            No verification document attached.
                        </p>
                    )}
                </div>

                {/* Modal Footer Close */}
                <div className="pt-2 flex justify-end">
                    <ClayButton
                        variant="beige"
                        size="md"
                        fullWidth={false}
                        onClick={onClose}
                    >
                        Close Window
                    </ClayButton>
                </div>
            </div>
        </ClayModal>
    );
};

export default PractitionerDetails;