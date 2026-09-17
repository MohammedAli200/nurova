import User from "../../models/User.js";

/**
 * Dashboard statistics
 */
export const getDashboardStats = async () => {
    const [
        totalUsers,
        totalPractitioners,
        pendingPractitioners,
        approvedPractitioners,
        rejectedPractitioners,
    ] = await Promise.all([
        User.countDocuments({
            role: "user",
        }),

        User.countDocuments({
            role: "practitioner",
        }),

        User.countDocuments({
            role: "practitioner",
            approvalStatus: "pending",
        }),

        User.countDocuments({
            role: "practitioner",
            approvalStatus: "approved",
        }),

        User.countDocuments({
            role: "practitioner",
            approvalStatus: "rejected",
        }),
    ]);

    return {
        totalUsers,
        totalPractitioners,
        pendingPractitioners,
        approvedPractitioners,
        rejectedPractitioners,
    };
};

/**
 * Get all practitioners
 */
export const getAllPractitioners = async ({
    status,
    specialization,
    search,
}) => {
    const filter = {
        role: "practitioner",
    };

    if (status) {
        filter.approvalStatus = status;
    }

    if (specialization) {
        filter.specialization = specialization;
    }

    if (search) {
        filter.$or = [
            {
                email: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                bio: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                specialization: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    const practitioners = await User.find(filter)
        .select("-password")
        .sort({
            createdAt: -1,
        });

    return practitioners;
};

/**
 * Get one practitioner
 */
export const getPractitionerById = async (
    practitionerId
) => {
    const practitioner = await User.findOne({
        _id: practitionerId,
        role: "practitioner",
    }).select("-password");

    if (!practitioner) {
        throw new Error(
            "Practitioner not found."
        );
    }

    return practitioner;
};

/**
 * Approve practitioner
 */
export const approvePractitioner = async (
    practitionerId
) => {
    const practitioner = await User.findOne({
        _id: practitionerId,
        role: "practitioner",
    });

    if (!practitioner) {
        throw new Error(
            "Practitioner not found."
        );
    }

    practitioner.approvalStatus = "approved";
    practitioner.isApproved = true;

    await practitioner.save();

    return {
        message:
            "Practitioner approved successfully.",
        practitioner: {
            id: practitioner._id,
            email: practitioner.email,
            specialization:
                practitioner.specialization,
            approvalStatus:
                practitioner.approvalStatus,
            isApproved:
                practitioner.isApproved,
        },
    };
};

/**
 * Reject practitioner
 */
export const rejectPractitioner = async (
    practitionerId
) => {
    const practitioner = await User.findOne({
        _id: practitionerId,
        role: "practitioner",
    });

    if (!practitioner) {
        throw new Error(
            "Practitioner not found."
        );
    }

    practitioner.approvalStatus = "rejected";
    practitioner.isApproved = false;

    await practitioner.save();

    return {
        message:
            "Practitioner rejected successfully.",
        practitioner: {
            id: practitioner._id,
            email: practitioner.email,
            specialization:
                practitioner.specialization,
            approvalStatus:
                practitioner.approvalStatus,
            isApproved:
                practitioner.isApproved,
        },
    };
};

/**
 * Get all normal users
 */
export const getAllUsers = async ({
    search,
}) => {
    const filter = {
        role: "user",
    };

    if (search) {
        filter.$or = [
            {
                email: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                username: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                bio: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    return User.find(filter)
        .select("-password")
        .sort({
            createdAt: -1,
        });
};