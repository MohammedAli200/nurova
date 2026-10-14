const {
    getDashboardStats,
    getAllPractitioners,
    getPractitionerById,
    approvePractitioner,
    rejectPractitioner,
    getAllUsers,
} = require("./admin.service");

/**
 * GET /api/admin/dashboard
 */
const dashboard = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        return res.status(200).json({
            success: true,
            stats,
        });
    } catch (error) {
        console.error("ADMIN DASHBOARD ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to load dashboard.",
        });
    }
};

/**
 * GET /api/admin/practitioners
 */
const practitioners = async (req, res) => {
    try {
        const { status, specialization, search } = req.query;
        const data = await getAllPractitioners({
            status,
            specialization,
            search,
        });

        return res.status(200).json({
            success: true,
            practitioners: data,
        });
    } catch (error) {
        console.error("ADMIN PRACTITIONERS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to load practitioners.",
        });
    }
};

/**
 * GET /api/admin/practitioners/:id
 */
const practitionerDetails = async (req, res) => {
    try {
        const practitioner = await getPractitionerById(req.params.id);
        return res.status(200).json({
            success: true,
            practitioner,
        });
    } catch (error) {
        console.error("PRACTITIONER DETAILS ERROR:", error);
        return res.status(404).json({
            success: false,
            message: error.message || "Practitioner not found.",
        });
    }
};

/**
 * PATCH /api/admin/practitioners/:id/approve
 */
const approve = async (req, res) => {
    try {
        const result = await approvePractitioner(req.params.id);
        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("APPROVE PRACTITIONER ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error.message || "Unable to approve practitioner.",
        });
    }
};

/**
 * PATCH /api/admin/practitioners/:id/reject
 */
const reject = async (req, res) => {
    try {
        const result = await rejectPractitioner(req.params.id);
        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("REJECT PRACTITIONER ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error.message || "Unable to reject practitioner.",
        });
    }
};

/**
 * GET /api/admin/users
 */
const users = async (req, res) => {
    try {
        const { search } = req.query;
        const data = await getAllUsers({ search });

        return res.status(200).json({
            success: true,
            users: data,
        });
    } catch (error) {
        console.error("ADMIN USERS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to load users.",
        });
    }
};

module.exports = {
    dashboard,
    practitioners,
    practitionerDetails,
    approve,
    reject,
    users,
};