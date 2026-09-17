import React from "react";
import ClayCard from "./ClayCard";
import CountUpNumber from "./CountUpNumber";

/**
 * ClayStatCard Component
 * Tactile statistic card with animated count-up numbers, icon hover physics, and Bitcount accents.
 */
const ClayStatCard = ({
    title,
    value,
    description,
    icon: Icon,
    badge,
    badgeType = "neutral", // "pending" | "approved" | "rejected" | "neutral"
    className = "",
}) => {
    const isNumeric = typeof value === "number" || (!isNaN(value) && !isNaN(parseFloat(value)));

    return (
        <ClayCard
            level="2"
            interactive
            className={`
                flex flex-col justify-between p-6 sm:p-7
                transition-all duration-300 group
                hover:shadow-clay-card-hover hover:-translate-y-1 hover:scale-[1.015]
                border border-white/60 hover:border-forest/20
                ${className}
            `}
        >
            <div className="flex items-start justify-between gap-3 mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-forest/70 group-hover:text-forest transition-colors">
                    {title}
                </p>

                {Icon && (
                    <div className="w-10 h-10 rounded-2xl bg-warmBeige flex items-center justify-center text-forest shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/50 group-hover:scale-110 group-hover:text-burntOrange group-hover:shadow-[inset_2px_2px_5px_rgba(201,120,75,0.18)] transition-all duration-300 flex-shrink-0">
                        <Icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-forest tracking-tight font-georama">
                    {isNumeric ? (
                        <CountUpNumber value={value} />
                    ) : (
                        value
                    )}
                </h3>

                {description && (
                    <p className="text-xs sm:text-sm text-forest/65 font-medium mt-1.5 leading-snug">
                        {description}
                    </p>
                )}
            </div>
        </ClayCard>
    );
};

export default ClayStatCard;
