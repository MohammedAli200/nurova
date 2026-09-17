import React from "react";
import { CheckCircle2, Clock, XCircle, Sparkles, ShieldCheck } from "lucide-react";

/**
 * ClayBadge Component
 * Tactile status indicator pill with distinct colors, micro-animations, and inset/elevated shadows.
 */
const ClayBadge = ({
    status = "neutral", // "pending" | "approved" | "rejected" | "forest" | "orange" | "neutral"
    children,
    size = "md", // "sm" | "md"
    showDot = true,
    showIcon = false,
    className = "",
}) => {
    const normalizedStatus = String(status).toLowerCase();

    const statusMap = {
        pending: {
            classes: "bg-warmBeige text-burntOrange border border-burntOrange/40 shadow-[inset_2px_2px_4px_rgba(53,92,69,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] font-bold",
            dot: "bg-burntOrange animate-pulse",
            icon: Clock,
            label: "Pending Review",
        },
        approved: {
            classes: "bg-forest text-sand shadow-[2px_3px_6px_rgba(53,92,69,0.22),-1px_-1px_4px_rgba(255,255,255,0.6)] border border-white/20 font-bold",
            dot: "bg-sand",
            icon: CheckCircle2,
            label: "Approved",
        },
        rejected: {
            classes: "bg-warmBeige text-rose-700 border border-rose-300 shadow-[inset_2px_2px_4px_rgba(53,92,69,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] font-bold",
            dot: "bg-rose-500",
            icon: XCircle,
            label: "Rejected",
        },
        cancelled: {
            classes: "bg-warmBeige text-rose-700 border border-rose-300 shadow-[inset_2px_2px_4px_rgba(53,92,69,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] font-bold",
            dot: "bg-rose-500",
            icon: XCircle,
            label: "Cancelled",
        },
        available: {
            classes: "bg-forest text-sand shadow-[2px_3px_6px_rgba(53,92,69,0.22)] border border-white/20 font-bold",
            dot: "bg-emerald-300 animate-pulse",
            icon: Sparkles,
            label: "Available",
        },
        booked: {
            classes: "bg-forest text-sand shadow-[2px_3px_6px_rgba(53,92,69,0.22)] border border-white/20 font-bold",
            dot: "bg-sand",
            icon: CheckCircle2,
            label: "Booked",
        },
        forest: {
            classes: "bg-forest text-sand shadow-[2px_3px_6px_rgba(53,92,69,0.22)] border border-white/20 font-bold",
            dot: "bg-sand",
            icon: ShieldCheck,
            label: "Forest",
        },
        orange: {
            classes: "bg-burntOrange text-white shadow-[2px_3px_6px_rgba(201,120,75,0.3)] border border-white/20 font-bold",
            dot: "bg-white",
            icon: Sparkles,
            label: "Orange",
        },
        neutral: {
            classes: "bg-warmBeige text-forest/80 border border-white/50 shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] font-bold",
            dot: "bg-forest/50",
            icon: null,
            label: "Neutral",
        },
    };

    const current = statusMap[normalizedStatus] || statusMap.neutral;
    const Icon = current.icon;
    const sizeClasses = size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs";

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 rounded-full uppercase tracking-wider select-none font-georama
                transition-all duration-200
                ${sizeClasses}
                ${current.classes}
                ${className}
            `}
        >
            {showIcon && Icon && <Icon className="w-3 h-3 flex-shrink-0" />}
            {showDot && !showIcon && (
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${current.dot}`} />
            )}
            <span>{children || current.label}</span>
        </span>
    );
};

export default ClayBadge;

