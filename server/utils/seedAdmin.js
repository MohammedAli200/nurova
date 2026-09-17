import User from "../models/User.js";

export const seedAdmin = async () => {
    try {
        const email =
            process.env.ADMIN_EMAIL?.trim().toLowerCase();

        const password =
            process.env.ADMIN_PASSWORD;

        const username =
            process.env.ADMIN_USER_NAME?.trim() ||
            "adminnurova";

        if (!email || !password) {
            console.log(
                "Admin credentials are not configured."
            );
            return;
        }

        const existingAdmin =
            await User.findOne({
                email,
            }).select("+password");

        if (existingAdmin) {
            console.log(
                "Admin account already exists:",
                email
            );
            return;
        }

        const admin = await User.create({
            email,
            username,
            password,
            bio: "Nurova Administrator",
            role: "admin",
            isApproved: true,
            approvalStatus: "approved",
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