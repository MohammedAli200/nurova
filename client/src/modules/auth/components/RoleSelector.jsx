import React from "react";
import { UserCheck, Stethoscope } from "lucide-react";

/**
 * RoleSelector Component
 * Tactile segmented switch for selecting between User and Practitioner registration.
 */
const RoleSelector = ({ role, setRole }) => {
    return (
        <div className="clay-surface-1 p-1.5 flex gap-2 rounded-2xl font-georama">
            <button
                type="button"
                onClick={() => setRole("user")}
                className={`
                    flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all duration-200
                    ${
                        role === "user"
                            ? "clay-btn-forest !shadow-[4px_4px_10px_rgba(53,92,69,0.3)] !transform-none"
                            : "text-forest/70 hover:text-forest hover:bg-white/40"
                    }
                `}
            >
                <UserCheck className="w-4 h-4 flex-shrink-0" />
                <span>User Account</span>
            </button>

            <button
                type="button"
                onClick={() => setRole("practitioner")}
                className={`
                    flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all duration-200
                    ${
                        role === "practitioner"
                            ? "clay-btn-forest !shadow-[4px_4px_10px_rgba(53,92,69,0.3)] !transform-none"
                            : "text-forest/70 hover:text-forest hover:bg-white/40"
                    }
                `}
            >
                <Stethoscope className="w-4 h-4 flex-shrink-0" />
                <span>Practitioner</span>
            </button>
        </div>
    );
};

export default RoleSelector;