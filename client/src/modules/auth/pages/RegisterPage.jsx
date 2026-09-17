import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../../components/layout/AuthLayout";
import RoleSelector from "../components/RoleSelector";
import UserRegisterForm from "../components/UserRegisterForm";
import PractitionerRegisterForm from "../components/PractitionerRegisterForm";

const RegisterPage = () => {
    const [role, setRole] = useState("user");

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Join the Nurova holistic wellness community today"
            maxWidth="max-w-2xl"
            footerLink={
                <span>
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-burntOrange font-bold hover:underline transition-all ml-1"
                    >
                        Sign in
                    </Link>
                </span>
            }
        >
            {/* Role Switcher */}
            <div className="mb-6">
                <RoleSelector role={role} setRole={setRole} />
            </div>

            {/* Selected Registration Form */}
            <div>
                {role === "user" ? (
                    <UserRegisterForm />
                ) : (
                    <PractitionerRegisterForm />
                )}
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;