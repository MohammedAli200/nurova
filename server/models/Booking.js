import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TherapySession",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        practitioner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: [
                "confirmed",
                "cancelled",
                "completed",
            ],
            default: "confirmed",
            index: true,
        },

        bookingNotes: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Unique partial index to prevent duplicate confirmed bookings for the same session at the DB level
bookingSchema.index(
    { session: 1 },
    {
        unique: true,
        partialFilterExpression: { status: "confirmed" },
    }
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ practitioner: 1, createdAt: -1 });

const Booking =
    mongoose.models.Booking ||
    mongoose.model("Booking", bookingSchema);

export default Booking;
