import React from "react";
import { FolderSearch, Sparkles } from "lucide-react";
import ClayCard from "./ClayCard";
import ClayButton from "./ClayButton";

/**
 * ClayEmptyState Component
 * Tactile empty state placeholder with customizable icon, title, action, and animated entrance.
 */
const ClayEmptyState = ({
    icon: Icon = FolderSearch,
    title = "No items found",
    description = "There are no records matching your current filter.",
    actionLabel,
    onAction,
    actionIcon,
    className = "",
}) => {
    return (
        <ClayCard
            level="2"
            className={`text-center py-12 px-6 animate-page-entrance border border-white/60 ${className}`}
        >
            <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-warmBeige flex items-center justify-center text-burntOrange shadow-[inset_3px_3px_6px_rgba(53,92,69,0.12),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] border border-white/50 animate-scale-pop">
                <Icon className="w-8 h-8 text-burntOrange" />
            </div>

            <h3 className="text-xl font-bold text-forest mb-1.5 tracking-tight">
                {title}
            </h3>

            <p className="text-sm text-forest/70 max-w-md mx-auto mb-6 leading-relaxed font-medium">
                {description}
            </p>

            {actionLabel && onAction && (
                <div className="flex justify-center">
                    <ClayButton
                        variant="forest"
                        size="md"
                        fullWidth={false}
                        icon={actionIcon || Sparkles}
                        onClick={onAction}
                    >
                        {actionLabel}
                    </ClayButton>
                </div>
            )}
        </ClayCard>
    );
};

export default ClayEmptyState;
