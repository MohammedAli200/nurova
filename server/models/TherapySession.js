import mongoose from "mongoose";

const therapySessionSchema = new mongoose.Schema(
    {
        practitioner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        specialization: {
            type: String,
            enum: [
                "physiotherapy",
                "acupuncture",
                "Ayurveda",
                "chiropractic",
            ],
            required: true,
        },

        startAt: {
            type: Date,
            required: true,
            index: true,
        },

        endAt: {
            type: Date,
            required: true,
            index: true,
        },

        duration: {
            type: Number, // duration in minutes
            required: true,
        },

        capacity: {
            type: Number,
            default: 1,
            min: 1,
        },

        bookedCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: [
                "available",
                "booked",
                "cancelled",
                "completed",
            ],
            default: "available",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient conflict checking and practitioner calendar lookups
therapySessionSchema.index({ practitioner: 1, startAt: 1, endAt: 1 });
therapySessionSchema.index({ status: 1, startAt: 1 });

const TherapySession =
    mongoose.models.TherapySession ||
    mongoose.model("TherapySession", therapySessionSchema);

export default TherapySession;
