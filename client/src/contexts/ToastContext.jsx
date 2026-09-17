import React, { createContext, useContext, useState, useCallback } from "react";
import ClayToast from "../components/ui/ClayToast";

const ToastContext = createContext({
    showToast: () => {},
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {},
});

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
        const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setToasts((prev) => [...prev, { id, type, title, message, duration }]);
        return id;
    }, []);

    const success = useCallback((message, title = "Success") => {
        return showToast({ type: "success", title, message });
    }, [showToast]);

    const error = useCallback((message, title = "Error") => {
        return showToast({ type: "error", title, message });
    }, [showToast]);

    const warning = useCallback((message, title = "Warning") => {
        return showToast({ type: "warning", title, message });
    }, [showToast]);

    const info = useCallback((message, title = "Info") => {
        return showToast({ type: "info", title, message });
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}

            {/* Global Floating Toast Stack */}
            <aside
                aria-label="Notifications"
                className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-2"
            >
                {toasts.map((toast) => (
                    <ClayToast
                        key={toast.id}
                        {...toast}
                        onClose={removeToast}
                    />
                ))}
            </aside>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export default ToastContext;
