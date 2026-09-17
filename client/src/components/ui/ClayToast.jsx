import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

/**
 * ClayToast Component
 * Tactile claymorphic notification pill with progress indicator and slide-in physics.
 */
const ClayToast = ({
    id,
    type = "success", // "success" | "error" | "warning" | "info"
    title,
    message,
    duration = 4000,
    onClose,
}) => {
    const [exiting, setExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!duration) return;

        const intervalTime = 20;
        const decrement = (intervalTime / duration) * 100;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev <= decrement) {
                    clearInterval(interval);
                    handleDismiss();
                    return 0;
                }
                return prev - decrement;
            });
        }, intervalTime);

        return () => clearInterval(interval);
    }, [duration]);

    const handleDismiss = () => {
        setExiting(true);
        setTimeout(() => {
            onClose(id);
        }, 250);
    };

    const typeConfig = {
        success: {
            icon: CheckCircle2,
            iconClass: "text-forest",
            bgClass: "bg-warmBeige border-forest/30",
            progressClass: "bg-forest",
            title: title || "Success",
        },
        error: {
            icon: AlertCircle,
            iconClass: "text-rose-600",
            bgClass: "bg-warmBeige border-rose-400/40",
            progressClass: "bg-rose-500",
            title: title || "Action Failed",
        },
        warning: {
            icon: AlertTriangle,
            iconClass: "text-burntOrange",
            bgClass: "bg-warmBeige border-burntOrange/40",
            progressClass: "bg-burntOrange",
            title: title || "Attention",
        },
        info: {
            icon: Info,
            iconClass: "text-forest",
            bgClass: "bg-warmBeige border-forest/25",
            progressClass: "bg-forest/60",
            title: title || "Information",
        },
    };

    const config = typeConfig[type] || typeConfig.info;
    const Icon = config.icon;

    return (
        <div
            className={`
                relative overflow-hidden w-80 sm:w-96 rounded-2xl p-4
                shadow-[8px_10px_24px_rgba(53,92,69,0.14),-6px_-6px_16px_rgba(255,255,255,0.9),inset_1px_1px_2px_rgba(255,255,255,0.8)]
                border backdrop-blur-md font-georama pointer-events-auto
                ${config.bgClass}
                ${exiting ? "animate-toast-out" : "animate-toast-in"}
            `}
            role="alert"
        >
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-warmBeige flex items-center justify-center shadow-[inset_1px_1px_3px_rgba(53,92,69,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.9)] flex-shrink-0">
                    <Icon className={`w-4 h-4 ${config.iconClass}`} />
                </div>

                <div className="flex-1 min-w-0 pr-1">
                    <p className="text-xs font-bold text-forest uppercase tracking-wider">
                        {config.title}
                    </p>
                    <p className="text-xs font-medium text-forest/80 mt-0.5 leading-snug">
                        {message}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleDismiss}
                    className="p-1 text-forest/50 hover:text-forest transition-colors rounded-lg flex-shrink-0 cursor-pointer"
                    aria-label="Close notification"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Progress countdown bar */}
            {duration > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-forest/10 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-75 ease-linear ${config.progressClass}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
};

export default ClayToast;
