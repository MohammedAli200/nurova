import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, UploadCloud, FileCheck, AlertCircle } from "lucide-react";
import ClayInput from "../../../components/ui/ClayInput";
import ClaySelect from "../../../components/ui/ClaySelect";
import ClayTextarea from "../../../components/ui/ClayTextarea";
import ClayButton from "../../../components/ui/ClayButton";
import { registerPractitioner } from "../services/authService";

const specializations = [
    { value: "physiotherapy", label: "Physiotherapy" },
    { value: "acupuncture", label: "Acupuncture" },
    { value: "Ayurveda", label: "Ayurveda" },
    { value: "chiropractic", label: "Chiropractic" },
];

const PractitionerRegisterForm = () => {
    const navigate = useNavigate();

   const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    specialization: "",
});

    const [document, setDocument] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if (!document) {
            setError("Please upload your certification or licensing document.");
            return;
        }

        const data = new FormData();
        data.append("name", form.name.trim());
        data.append("email", form.email.trim().toLowerCase());
        data.append("password", form.password);
        data.append("bio", form.bio.trim());
        data.append("specialization", form.specialization);
        data.append("document", document);

        setLoading(true);

        try {
            await registerPractitioner(data);
            navigate("/login?registered=practitioner");
        } catch (err) {
            console.error("REGISTER PRACTITIONER ERROR:", err);
            setError(
                err.response?.data?.message ||
                "Registration failed. Please review your details."
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
            label="Full Name"
            type="text"
              placeholder="Enter your full name"
             value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
             required
            />

            <ClayInput
                label="Professional Email"
                type="email"
                placeholder="doctor@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                icon={Mail}
                required
            />

            <ClayInput
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                icon={Lock}
                required
                helperText="Must be at least 8 characters"
            />

            <ClaySelect
                label="Field of Specialization"
                placeholder="Select your specialization"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                options={specializations}
                required
            />

            <ClayTextarea
                label="Professional Bio"
                placeholder="Describe your qualifications, clinical focus, and patient experience..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
            />

            {/* Tactile Clay Upload Dropzone */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest/80 mb-1.5 ml-1">
                    License / Certification Document <span className="text-burntOrange">*</span>
                </label>

                <div className="clay-surface-1 p-5 text-center relative hover:border-forest transition-colors rounded-2xl">
                    <input
                        type="file"
                        accept="application/pdf,image/png,image/jpeg,image/jpg"
                        onChange={(e) => setDocument(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required
                    />

                    <div className="flex flex-col items-center justify-center pointer-events-none">
                        {document ? (
                            <div className="flex items-center gap-2 text-forest font-semibold text-sm">
                                <FileCheck className="w-5 h-5 text-forest" />
                                <span className="truncate max-w-xs">{document.name}</span>
                            </div>
                        ) : (
                            <>
                                <UploadCloud className="w-7 h-7 text-burntOrange mb-1.5" />
                                <p className="text-xs font-bold text-forest">
                                    Click or drag license file here
                                </p>
                                <p className="text-[11px] text-forest/60 mt-0.5">
                                    PDF, PNG, JPG or JPEG · Max 5 MB
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <ClayButton
                    type="submit"
                    variant="forest"
                    size="lg"
                    loading={loading}
                >
                    Submit Practitioner Application
                </ClayButton>
            </div>
        </form>
    );
};

export default PractitionerRegisterForm;