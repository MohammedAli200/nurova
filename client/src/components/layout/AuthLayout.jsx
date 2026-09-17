import React from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

/**
 * AuthLayout Component
 * Tactile claymorphic layout for login and registration views with brand presence and organic warmth.
 */
const AuthLayout = ({
    title,
    subtitle,
    children,
    footerLink,
    maxWidth = "max-w-xl",
}) => {
    return (
        <div className="min-h-screen bg-sand flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden font-georama">
            {/* Ambient Background Clay Blooms */}
            <div
                className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-warmBeige/60 blur-3xl pointer-events-none -z-0"
                aria-hidden="true"
            />
            <div
                className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-warmBeige/60 blur-3xl pointer-events-none -z-0"
                aria-hidden="true"
            />

            <div className={`w-full ${maxWidth} z-10 mx-auto animate-page-entrance`}>
                {/* Main Clay Container Card */}
                <div className="clay-surface-2 p-6 sm:p-10 relative border border-white/80 shadow-2xl">
                    {/* Brand Header */}
                    <div className="text-center mb-7">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warmBeige shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/50 mb-3 animate-scale-pop">
                            <Sparkles className="w-3.5 h-3.5 text-burntOrange" />
                            <span className="font-bitcount text-burntOrange text-sm tracking-widest uppercase font-bold">
                                NUROVA
                            </span>
                        </div>

                        {title && (
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-forest mt-1 tracking-tight">
                                {title}
                            </h1>
                        )}

                        {subtitle && (
                            <p className="text-forest/70 mt-1.5 text-sm font-medium">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Main Form Slot */}
                    {children}

                    {/* Footer Links */}
                    {footerLink && (
                        <div className="mt-7 pt-5 border-t border-forest/10 text-center text-sm font-medium text-forest/70">
                            {footerLink}
                        </div>
                    )}
                </div>

                {/* Trust and Security Marker */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-forest/50">
                    <ShieldCheck className="w-4 h-4 text-forest/60" />
                    <span>Holistic Healthcare & Practitioner Network</span>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
