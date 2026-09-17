import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        username: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },

        bio: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            enum: [
                "user",
                "practitioner",
                "admin",
            ],
            default: "user",
        },

        specialization: {
            type: String,
            enum: [
                "physiotherapy",
                "acupuncture",
                "Ayurveda",
                "chiropractic",
            ],
        },

        document: {
            filename: String,
            path: String,
            mimetype: String,
            size: Number,
        },

        isApproved: {
            type: Boolean,
            default: false,
        },

        approvalStatus: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
            ],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre(
    "save",
    async function (next) {
        if (!this.isModified("password")) {
            return next();
        }

        const salt =
            await bcrypt.genSalt(10);

        this.password =
            await bcrypt.hash(
                this.password,
                salt
            );

        next();
    }
);

userSchema.methods.comparePassword =
    async function (candidatePassword) {
        return bcrypt.compare(
            candidatePassword,
            this.password
        );
    };

const User =
    mongoose.models.User ||
    mongoose.model(
        "User",
        userSchema
    );

export default User;