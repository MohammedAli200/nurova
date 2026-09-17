import React from "react";

/**
 * ClayBackground Component
 * Adds living, ambient depth to the wellness platform with slow-moving organic blobs.
 * Completely pointer-events-none and low-opacity to avoid distracting from primary content.
 */
const ClayBackground = () => {
    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none"
            aria-hidden="true"
        >
            {/* Top-left organic warm beige blob */}
            <div
                className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-warmBeige/40 blur-[100px] animate-blob-1"
            />

            {/* Top-right low-opacity forest blob */}
            <div
                className="absolute top-1/4 -right-40 w-[32rem] h-[32rem] rounded-full bg-forest/8 blur-[120px] animate-blob-2"
            />

            {/* Bottom-left subtle burnt orange accent glow */}
            <div
                className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] rounded-full bg-burntOrange/6 blur-[110px] animate-blob-3"
            />

            {/* Bottom-right soft sand-light glow */}
            <div
                className="absolute bottom-10 right-10 w-[24rem] h-[24rem] rounded-full bg-warmBeige/50 blur-[90px] animate-blob-1"
            />
        </div>
    );
};

export default ClayBackground;
