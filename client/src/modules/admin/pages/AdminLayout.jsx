import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

/**
 * AdminLayout Component
 * Responsive Admin container canvas with 60% Sand background and tactile clay navigation.
 */
const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-sand p-4 sm:p-6 lg:p-8 font-georama antialiased">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
                {/* Admin Sidebar Navigation */}
                <AdminSidebar />

                {/* Main Admin Content Outlet Canvas */}
                <main className="flex-1 w-full min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;