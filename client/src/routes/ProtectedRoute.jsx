import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2, Sparkles } from "lucide-react";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-sand flex flex-col items-center justify-center font-georama">
                <div className="clay-surface-2 p-8 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-warmBeige flex items-center justify-center text-burntOrange shadow-[inset_2px_2px_4px_rgba(53,92,69,0.12),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]">
                        <Sparkles className="w-6 h-6 animate-spin" />
                    </div>
                    <p className="text-sm font-bold text-forest uppercase tracking-wider">
                        Verifying Session...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;