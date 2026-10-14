require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const connectDB = require("../config/db");

const seedAdmin = async () => {
    try {
        const email =
            process.env.ADMIN_EMAIL?.trim().toLowerCase() || "nurova@admin.com";

        const rawPassword =
            process.env.ADMIN_PASSWORD || "nurova123";

        const username =
            process.env.ADMIN_USER_NAME?.trim() ||
            "adminnurova";

        if (!email || !rawPassword) {
            console.log(
                "Admin credentials are not configured."
            );
            return;
        }

        const existingAdmin =
            await User.findOne({
                $or: [{ email }, { username }],
            });

        if (existingAdmin) {
            console.log(
                "Admin account already exists:",
                existingAdmin.email
            );
            return;
        }

        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const admin = await User.create({
            name: "Administrator",
            email,
            username,
            password: hashedPassword,
            bio: "Nurova Administrator",
            role: "admin",
            isApproved: true,
            approvalStatus: "approved",
            verificationStatus: "approved",
            isActive: true,
        });

        console.log(
            "Admin account created successfully:",
            admin.email
        );

    } catch (error) {
        console.error(
            "Admin seed error:",
            error
        );
    }
};

// If run directly: node utils/seedAdmin.js
if (require.main === module) {
    (async () => {
        await connectDB();
        await seedAdmin();
        await mongoose.connection.close();
        process.exit(0);
    })();
}

module.exports = { seedAdmin };