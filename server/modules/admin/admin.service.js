const User = require("../../models/user");
const Practitioner = require("../../models/practitioner");
const PractitionerDocument = require("../../models/practitionerdocument");

/**
 * Dashboard statistics
 */
const getDashboardStats = async () => {
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
            $or: [
                { approvalStatus: "pending" },
                { verificationStatus: "pending" },
            ],
        }),

        User.countDocuments({
            role: "practitioner",
            $or: [
                { approvalStatus: "approved" },
                { verificationStatus: "approved" },
                { isApproved: true },
            ],
        }),

        User.countDocuments({
            role: "practitioner",
            $or: [
                { approvalStatus: "rejected" },
                { verificationStatus: "rejected" },
            ],
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
const getAllPractitioners = async ({
    status,
    specialization,
    search,
}) => {
    const filter = {
        role: "practitioner",
    };

    if (status) {
        if (status === "pending") {
            filter.$or = [
                { approvalStatus: "pending" },
                { verificationStatus: "pending" },
            ];
        } else if (status === "approved" || status === "verified") {
            filter.$or = [
                { approvalStatus: "approved" },
                { verificationStatus: "approved" },
                { isApproved: true },
            ];
        } else if (status === "rejected") {
            filter.$or = [
                { approvalStatus: "rejected" },
                { verificationStatus: "rejected" },
            ];
        }
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
                name: {
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
const getPractitionerById = async (practitionerId) => {
    let practitioner = await User.findOne({
        _id: practitionerId,
        role: "practitioner",
    }).select("-password");

    if (!practitioner) {
        practitioner = await Practitioner.findById(practitionerId).select("-password");
    }

    if (!practitioner) {
        throw new Error("Practitioner not found.");
    }

    return practitioner;
};

/**
 * Approve practitioner
 */
const approvePractitioner = async (practitionerId) => {
    let practitioner = await User.findOne({
        _id: practitionerId,
        role: "practitioner",
    });

    if (practitioner) {
        practitioner.approvalStatus = "approved";
        practitioner.verificationStatus = "approved";
        practitioner.isApproved = true;
        await practitioner.save();
    } else {
        practitioner = await Practitioner.findById(practitionerId);
        if (practitioner) {
            practitioner.verificationStatus = "approved";
            practitioner.isActive = true;
            await practitioner.save();
        }
    }

    if (!practitioner) {
        throw new Error("Practitioner not found.");
    }

    return {
        message: "Practitioner approved successfully.",
        practitioner: {
            id: practitioner._id,
            email: practitioner.email,
            specialization: practitioner.specialization,
            approvalStatus: practitioner.approvalStatus || "approved",
            isApproved: true,
        },
    };
};

/**
 * Reject practitioner
 */
const rejectPractitioner = async (practitionerId) => {
    let practitioner = await User.findOne({
        _id: practitionerId,
        role: "practitioner",
    });

    if (practitioner) {
        practitioner.approvalStatus = "rejected";
        practitioner.verificationStatus = "rejected";
        practitioner.isApproved = false;
        await practitioner.save();
    } else {
        practitioner = await Practitioner.findById(practitionerId);
        if (practitioner) {
            practitioner.verificationStatus = "rejected";
            practitioner.isActive = false;
            await practitioner.save();
        }
    }

    if (!practitioner) {
        throw new Error("Practitioner not found.");
    }

    return {
        message: "Practitioner rejected successfully.",
        practitioner: {
            id: practitioner._id,
            email: practitioner.email,
            specialization: practitioner.specialization,
            approvalStatus: practitioner.approvalStatus || "rejected",
            isApproved: false,
        },
    };
};

/**
 * Get all normal users
 */
const getAllUsers = async ({ search }) => {
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
                name: {
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

module.exports = {
    getDashboardStats,
    getAllPractitioners,
    getPractitionerById,
    approvePractitioner,
    rejectPractitioner,
    getAllUsers,
};