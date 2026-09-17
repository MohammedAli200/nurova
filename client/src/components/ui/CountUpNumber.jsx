import React, { useEffect, useState } from "react";

/**
 * CountUpNumber Component
 * Smoothly animates numbers from 0 to value with easeOut interpolation.
 */
export const CountUpNumber = ({
    value = 0,
    duration = 600,
    prefix = "",
    suffix = "",
    className = "",
}) => {
    const numericValue = typeof value === "number" ? value : parseInt(value, 10) || 0;
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        // If reduced motion is preferred, jump straight to value
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setDisplayValue(numericValue);
            return;
        }

        let startTimestamp = null;
        const startValue = 0;
        let animationFrameId;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutExpo / easeOutQuad curve
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (numericValue - startValue) * easeProgress);

            setDisplayValue(current);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(step);
            } else {
                setDisplayValue(numericValue);
            }
        };

        animationFrameId = requestAnimationFrame(step);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [numericValue, duration]);

    return (
        <span className={className}>
            {prefix}
            {displayValue.toLocaleString()}
            {suffix}
        </span>
    );
};

export default CountUpNumber;
