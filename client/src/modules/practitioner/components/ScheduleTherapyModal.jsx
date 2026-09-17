import React, { useState } from "react";
import { Sparkles, Calendar, Clock, AlertCircle } from "lucide-react";
import ClayModal from "../../../components/ui/ClayModal";
import ClayInput from "../../../components/ui/ClayInput";
import ClaySelect from "../../../components/ui/ClaySelect";
import ClayTextarea from "../../../components/ui/ClayTextarea";
import ClayButton from "../../../components/ui/ClayButton";
import { createPractitionerSession } from "../../booking/services/bookingService";

const specializations = [
    { value: "physiotherapy", label: "Physiotherapy" },
    { value: "acupuncture", label: "Acupuncture" },
    { value: "Ayurveda", label: "Ayurveda" },
    { value: "chiropractic", label: "Chiropractic" },
];

const ScheduleTherapyModal = ({
    isOpen,
    onClose,
    onSessionCreated,
    defaultSpecialization = "physiotherapy",
}) => {
    // Default to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const [form, setForm] = useState({
        title: "",
        specialization: defaultSpecialization || "physiotherapy",
        date: tomorrowStr,
        startTime: "10:00",
        endTime: "11:00",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.title.trim()) {
            setError("Please provide a title for the therapy session.");
            return;
        }

        if (!form.date || !form.startTime || !form.endTime) {
            setError("Date, start time, and end time are required.");
            return;
        }

        const startAt = new Date(`${form.date}T${form.startTime}:00`);
        const endAt = new Date(`${form.date}T${form.endTime}:00`);

        if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) {
            setError("Invalid date or time entered.");
            return;
        }

        if (startAt <= new Date()) {
            setError("Therapy session cannot be scheduled in the past.");
            return;
        }

        if (endAt <= startAt) {
            setError("End time must be after the start time.");
            return;
        }

        const durationMinutes = Math.round(
            (endAt.getTime() - startAt.getTime()) / (1000 * 60)
        );

        if (durationMinutes < 15) {
            setError("Session duration must be at least 15 minutes.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title: form.title.trim(),
                specialization: form.specialization,
                startAt: startAt.toISOString(),
                endAt: endAt.toISOString(),
                duration: durationMinutes,
                description: form.description.trim(),
            };

            await createPractitionerSession(payload);

            if (onSessionCreated) {
                onSessionCreated();
            }

            onClose();
        } catch (err) {
            console.error("CREATE SESSION ERROR:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to schedule therapy session."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ClayModal
            isOpen={isOpen}
            onClose={onClose}
            subtitle="PRACTITIONER SCHEDULING"
            title="Schedule New Therapy"
            maxWidth="max-w-xl"
        >
            <form onSubmit={handleSubmit} className="space-y-4 font-georama text-left">
                {error && (
                    <div className="p-3.5 rounded-2xl bg-warmBeige text-burntOrange border border-burntOrange/30 shadow-[inset_2px_2px_4px_rgba(201,120,75,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] flex items-start gap-2.5 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <ClayInput
                    label="Therapy Title"
                    name="title"
                    type="text"
                    placeholder="e.g., Deep Tissue Alignment & Pain Relief"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <ClaySelect
                    label="Specialization Field"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    options={specializations}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <ClayInput
                        label="Date"
                        name="date"
                        type="date"
                        value={form.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                        required
                        icon={Calendar}
                    />

                    <ClayInput
                        label="Start Time"
                        name="startTime"
                        type="time"
                        value={form.startTime}
                        onChange={handleChange}
                        required
                        icon={Clock}
                    />

                    <ClayInput
                        label="End Time"
                        name="endTime"
                        type="time"
                        value={form.endTime}
                        onChange={handleChange}
                        required
                        icon={Clock}
                    />
                </div>

                <ClayTextarea
                    label="Session Overview (Optional)"
                    name="description"
                    placeholder="Describe the therapeutic goals, techniques used, and client preparation guidelines..."
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                />

                <div className="pt-3 flex items-center justify-end gap-3">
                    <ClayButton
                        type="button"
                        variant="beige"
                        size="md"
                        fullWidth={false}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </ClayButton>

                    <ClayButton
                        type="submit"
                        variant="forest"
                        size="md"
                        fullWidth={false}
                        loading={loading}
                        icon={Sparkles}
                    >
                        Publish Session
                    </ClayButton>
                </div>
            </form>
        </ClayModal>
    );
};

export default ScheduleTherapyModal;
