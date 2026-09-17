import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import ClayCard from "./ClayCard";
import ClayButton from "./ClayButton";

/**
 * ClayErrorState Component
 * Tactile error feedback container with optional retry button.
 */
const ClayErrorState = ({
    title = "Something went wrong",
    message = "Unable to load data at this time.",
    onRetry,
    className = "",
}) => {
    return (
        <ClayCard
            level="2"
            className={`border border-burntOrange/40 text-center py-10 px-6 ${className}`}
        >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-warmBeige flex items-center justify-center text-burntOrange shadow-[inset_3px_3px_6px_rgba(201,120,75,0.2),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] border border-burntOrange/20">
                <AlertCircle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-forest mb-1">
                {title}
            </h3>

            <p className="text-sm text-burntOrange font-medium max-w-md mx-auto mb-6">
                {message}
            </p>

            {onRetry && (
                <div className="flex justify-center">
                    <ClayButton
                        variant="orange"
                        size="md"
                        fullWidth={false}
                        icon={RotateCcw}
                        onClick={onRetry}
                    >
                        Try Again
                    </ClayButton>
                </div>
            )}
        </ClayCard>
    );
};

export default ClayErrorState;
