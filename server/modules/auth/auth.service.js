import User from "../../models/User.js";
import { generateToken } from "../../services/tokenService.js";

/**
 * Register normal user
 */
export const registerUser = async ({
    email,
    username,
    password,
    bio,
}) => {
    if (!email || !username || !password) {
        throw new Error(
            "Email, username and password are required."
        );
    }

    const normalizedEmail =
        email.trim().toLowerCase();

    const normalizedUsername =
        username.trim();

    const existingEmail = await User.findOne({
        email: normalizedEmail,
    });

    if (existingEmail) {
        throw new Error(
            "An account with this email already exists."
        );
    }

    const existingUsername = await User.findOne({
        username: normalizedUsername,
    });

    if (existingUsername) {
        throw new Error(
            "This username is already taken."
        );
    }

    const user = await User.create({
        email: normalizedEmail,
        username: normalizedUsername,
        password,
        bio: bio || "",
        role: "user",
    });

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user._id,
            email: user.email,
            username: user.username,
            bio: user.bio,
            role: user.role,
        },
    };
};


/**
 * Register practitioner
 */
export const registerPractitioner = async ({
    email,
    password,
    bio,
    specialization,
    document,
}) => {
    if (!email || !password || !specialization) {
        throw new Error(
            "Email, password and specialization are required."
        );
    }

    const normalizedEmail =
        email.trim().toLowerCase();

    const allowedSpecializations = [
        "physiotherapy",
        "acupuncture",
        "Ayurveda",
        "chiropractic",
    ];

    if (
        !allowedSpecializations.includes(
            specialization
        )
    ) {
        throw new Error(
            "Invalid specialization."
        );
    }

    const existingEmail = await User.findOne({
        email: normalizedEmail,
    });

    if (existingEmail) {
        throw new Error(
            "An account with this email already exists."
        );
    }

    const practitioner = await User.create({
        email: normalizedEmail,
        password,
        bio: bio || "",
        specialization,
        role: "practitioner",

        document: document
            ? {
                filename: document.filename,
                path: document.path,
                mimetype: document.mimetype,
                size: document.size,
            }
            : undefined,

        isApproved: false,
        approvalStatus: "pending",
    });
    return {
        message:
            "Practitioner registration submitted successfully. Awaiting admin approval.",

        user: {
            id: practitioner._id,
            email: practitioner.email,
            bio: practitioner.bio,
            specialization: practitioner.specialization,
            role: practitioner.role,
            isApproved: practitioner.isApproved,
            approvalStatus: practitioner.approvalStatus,
        },
    };
};


/**
 * Login
 *
 * Login accepts either:
 * - username
 * - email
 */
export const login = async ({
    username,
    password,
}) => {
    if (!username || !password) {
        throw new Error(
            "Username and password are required."
        );
    }

    const identifier =
        username.trim().toLowerCase();

    const user = await User.findOne({
        $or: [
            {
                email: identifier,
            },
            {
                username: username.trim(),
            },
        ],
    }).select("+password");

    if (!user) {
        throw new Error(
            "Invalid username or password."
        );
    }

    const passwordCorrect =
        await user.comparePassword(password);

    if (!passwordCorrect) {
        throw new Error(
            "Invalid username or password."
        );
    }

    if (
        user.role === "practitioner" &&
        !user.isApproved
    ) {
        throw new Error(
            "Your practitioner account is waiting for admin approval."
        );
    }

    const token = generateToken(user);

    return {
        token,

        user: {
            id: user._id,
            email: user.email,
            username: user.username,
            bio: user.bio,
            role: user.role,
            specialization:
                user.specialization,
            isApproved:
                user.isApproved,
        },
    };
};


/**
 * Get currently authenticated user
 */
export const getCurrentUser = async (
    userId
) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error(
            "User not found."
        );
    }

    return {
        id: user._id,
        email: user.email,
        username: user.username,
        bio: user.bio,
        role: user.role,
        specialization:
            user.specialization,
        isApproved:
            user.isApproved,
        document:
            user.document || null,
    };
};