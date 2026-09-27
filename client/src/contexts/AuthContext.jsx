import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { getMe } from "../modules/auth/services/authService";
import { storage } from "../utils/storage";
import { ROLES, VERIFICATION_STATUSES } from "../config/constants";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        const loadUser = async () => {
            try {
                const result = await getMe();
                setUser(result.user);
            } catch (error) {
                console.error("Failed to restore authentication:", error);

                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const showToast = (message, type = "info") => {
        setToastMessage({
            message,
            type,
            id: Date.now(),
        });

        setTimeout(() => {
            setToastMessage(null);
        }, 4000);
    };

    const login = (token, userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);

        showToast(
            `Welcome back, ${userData?.name || userData?.email || "User"}!`,
            "success"
        );
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

        showToast("Logged out successfully", "info");
    };

    const updatePractitionerStatus = (newStatus) => {
        if (!user || user.role !== ROLES.PRACTITIONER) return;

        let progress = 40;

        if (newStatus === VERIFICATION_STATUSES.UNDER_REVIEW) {
            progress = 70;
        }

        if (newStatus === VERIFICATION_STATUSES.VERIFIED) {
            progress = 100;
        }

        if (newStatus === VERIFICATION_STATUSES.ACTION_REQUIRED) {
            progress = 50;
        }

        const updated = {
            ...user,
            verificationStatus: newStatus,
            verificationProgress: progress,
        };

        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));

        showToast(
            `Verification status updated to: ${newStatus
                .replace("_", " ")
                .toUpperCase()}`,
            "success"
        );
    };

    const addPractitionerDocument = (newDoc) => {
        if (!user || user.role !== ROLES.PRACTITIONER) return;

        const existingDocs = user.documents || [];

        const updated = {
            ...user,
            documents: [...existingDocs, newDoc],
        };

        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));

        showToast(
            `Document "${newDoc.title}" uploaded for verification!`,
            "success"
        );
    };

    const removePractitionerDocument = (docId) => {
        if (!user || user.role !== ROLES.PRACTITIONER) return;

        const updatedDocs = (user.documents || []).filter(
            (document) => document.id !== docId
        );

        const updated = {
            ...user,
            documents: updatedDocs,
        };

        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));

        showToast("Document removed from records", "info");
    };

    const updateSpecializationTags = (tags) => {
        if (!user || user.role !== ROLES.PRACTITIONER) return;

        const updated = {
            ...user,
            specializationTags: tags,
        };

        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));

        showToast("Therapy specializations updated!", "success");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                currentUser: user,
                isAuthenticated: !!user,
                role: user?.role || null,
                loading,
                toastMessage,
                showToast,
                login,
                logout,
                updatePractitionerStatus,
                addPractitionerDocument,
                removePractitionerDocument,
                updateSpecializationTags,
                setUser,
                setCurrentUser: setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};