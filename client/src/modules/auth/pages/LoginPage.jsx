import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";

import ClayInput from "../../../components/ui/ClayInput";
import ClayButton from "../../../components/ui/ClayButton";
import AuthLayout from "../../../components/layout/AuthLayout";

import { loginUser } from "../services/authService";
import { useAuth } from "../../../contexts/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { login } = useAuth();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isRegistered = searchParams.get("registered");

    const submit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const result = await loginUser(form);

            login(result.token, result.user);

            if (result.user.role === "admin") {
                navigate("/admin");
            } else if (result.user.role === "practitioner") {
                navigate("/practitioner");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Invalid credentials. Please verify and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your credentials to access your Nurova workspace"
            footerLink={
                <span>
                    Don't have an account yet?{" "}
                    <Link
                        to="/register"
                        className="text-burntOrange font-bold hover:underline transition-all ml-1"
                    >
                        Sign up now
                    </Link>
                </span>
            }
        >
            {/* Practitioner registration success */}
            {isRegistered === "practitioner" && (
                <div className="mb-5 p-3.5 rounded-2xl bg-warmBeige text-forest border border-forest/30 shadow-[inset_2px_2px_4px_rgba(53,92,69,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] flex items-start gap-2.5 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />

                    <span>
                        Application submitted successfully! Your account will
                        be activated once verified by an administrator.
                    </span>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-5 p-3.5 rounded-2xl bg-warmBeige text-burntOrange border border-burntOrange/30 shadow-[inset_2px_2px_4px_rgba(201,120,75,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] flex items-start gap-2.5 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />

                    <span>{error}</span>
                </div>
            )}

            {/* Login form */}
            <form onSubmit={submit} className="space-y-4">
                <ClayInput
                    label="Username"
                    type="text"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            username: e.target.value,
                        })
                    }
                    icon={User}
                    required
                />

                <ClayInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password: e.target.value,
                        })
                    }
                    icon={Lock}
                    required
                />

                <div className="pt-2">
                    <ClayButton
                        type="submit"
                        variant="forest"
                        size="lg"
                        loading={loading}
                    >
                        Sign In
                    </ClayButton>
                </div>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;