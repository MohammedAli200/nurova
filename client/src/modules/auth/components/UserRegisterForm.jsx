import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, Lock, FileText, AlertCircle } from "lucide-react";
import ClayInput from "../../../components/ui/ClayInput";
import ClayTextarea from "../../../components/ui/ClayTextarea";
import ClayButton from "../../../components/ui/ClayButton";
import { registerUser } from "../services/authService";
import { useAuth } from "../../../contexts/AuthContext";

const UserRegisterForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        bio: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const payload = {
                email: form.email.trim().toLowerCase(),
                username: form.username.trim(),
                password: form.password,
                bio: form.bio.trim(),
            };

            const result = await registerUser(payload);

            if (!result?.token || !result?.user) {
                throw new Error(
                    "Registration succeeded but the server did not return a login token."
                );
            }

            login(result.token, result.user);
            navigate("/dashboard");
        } catch (err) {
            console.error("REGISTER USER ERROR:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4 font-georama text-left">
            {error && (
                <div className="p-3.5 rounded-2xl bg-warmBeige text-burntOrange border border-burntOrange/30 shadow-[inset_2px_2px_4px_rgba(201,120,75,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] flex items-start gap-2.5 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <ClayInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                icon={Mail}
                required
            />

            <ClayInput
                label="Username"
                name="username"
                type="text"
                placeholder="Choose your username"
                value={form.username}
                onChange={handleChange}
                icon={User}
                required
            />

            <ClayInput
                label="Password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                icon={Lock}
                required
                helperText="Must be at least 8 characters"
            />

            <ClayTextarea
                label="Bio (Optional)"
                name="bio"
                placeholder="Tell the community a little about your wellness journey..."
                value={form.bio}
                onChange={handleChange}
                rows={3}
            />

            <div className="pt-2">
                <ClayButton
                    type="submit"
                    variant="forest"
                    size="lg"
                    loading={loading}
                >
                    Create User Account
                </ClayButton>
            </div>
        </form>
    );
};

export default UserRegisterForm;