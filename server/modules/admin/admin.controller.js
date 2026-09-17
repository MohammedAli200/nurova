import {
    getDashboardStats,
    getAllPractitioners,
    getPractitionerById,
    approvePractitioner,
    rejectPractitioner,
    getAllUsers,
} from "./admin.service.js";

/**
 * GET /api/admin/dashboard
 */
export const dashboard = async (
    req,
    res
) => {
    try {
        const stats =
            await getDashboardStats();

        return res.status(200).json({
            stats,
        });
    } catch (error) {
        console.error(
            "ADMIN DASHBOARD ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to load dashboard.",
        });
    }
};

/**
 * GET /api/admin/practitioners
 */
export const practitioners = async (
    req,
    res
) => {
    try {
        const {
            status,
            specialization,
            search,
        } = req.query;

        const data =
            await getAllPractitioners({
                status,
                specialization,
                search,
            });

        return res.status(200).json({
            practitioners: data,
        });
    } catch (error) {
        console.error(
            "ADMIN PRACTITIONERS ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to load practitioners.",
        });
    }
};

/**
 * GET /api/admin/practitioners/:id
 */
export const practitionerDetails = async (
    req,
    res
) => {
    try {
        const practitioner =
            await getPractitionerById(
                req.params.id
            );

        return res.status(200).json({
            practitioner,
        });
    } catch (error) {
        console.error(
            "PRACTITIONER DETAILS ERROR:",
            error
        );

        return res.status(404).json({
            message:
                error.message ||
                "Practitioner not found.",
        });
    }
};

/**
 * PATCH /api/admin/practitioners/:id/approve
 */
export const approve = async (
    req,
    res
) => {
    try {
        const result =
            await approvePractitioner(
                req.params.id
            );

        return res.status(200).json(result);
    } catch (error) {
        console.error(
            "APPROVE PRACTITIONER ERROR:",
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                "Unable to approve practitioner.",
        });
    }
};

/**
 * PATCH /api/admin/practitioners/:id/reject
 */
export const reject = async (
    req,
    res
) => {
    try {
        const result =
            await rejectPractitioner(
                req.params.id
            );

        return res.status(200).json(result);
    } catch (error) {
        console.error(
            "REJECT PRACTITIONER ERROR:",
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                "Unable to reject practitioner.",
        });
    }
};

/**
 * GET /api/admin/users
 */
export const users = async (
    req,
    res
) => {
    try {
        const { search } =
            req.query;

        const data =
            await getAllUsers({
                search,
            });

        return res.status(200).json({
            users: data,
        });
    } catch (error) {
        console.error(
            "ADMIN USERS ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to load users.",
        });
    }
};