import {
    registerUser as registerUserService,
    registerPractitioner as registerPractitionerService,
    login as loginService,
    getCurrentUser as getCurrentUserService,
} from "./auth.service.js";


/**
 * POST /api/auth/register/user
 */
export const registerUser = async (req, res) => {
    try {
        const {
            email,
            username,
            password,
            bio,
        } = req.body;

        const result =
            await registerUserService({
                email,
                username,
                password,
                bio,
            });

        return res.status(201).json(result);

    } catch (error) {
        console.error(
            "REGISTER USER ERROR:",
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                "User registration failed.",
        });
    }
};


/**
 * POST /api/auth/register/practitioner
 */
export const registerPractitioner = async (
    req,
    res
) => {
    try {
        const {
            email,
            password,
            bio,
            specialization,
        } = req.body;

        const result =
            await registerPractitionerService({
                email,
                password,
                bio,
                specialization,
                document: req.file,
            });

        return res.status(201).json(result);

    } catch (error) {
        console.error(
            "REGISTER PRACTITIONER ERROR:",
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                "Practitioner registration failed.",
        });
    }
};


/**
 * POST /api/auth/login
 */
export const login = async (req, res) => {
    try {
        const {
            username,
            password,
        } = req.body;

        const result =
            await loginService({
                username,
                password,
            });

        return res.status(200).json(result);

    } catch (error) {
        console.error(
            "LOGIN ERROR:",
            error
        );

        return res.status(401).json({
            message:
                error.message ||
                "Login failed.",
        });
    }
};


/**
 * GET /api/auth/me
 */
export const getCurrentUser = async (
    req,
    res
) => {
    try {
        const userId =
            req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message:
                    "Authentication information is missing.",
            });
        }

        const user =
            await getCurrentUserService(
                userId
            );

        return res.status(200).json({
            user,
        });

    } catch (error) {
        console.error(
            "GET CURRENT USER ERROR:",
            error
        );

        return res.status(404).json({
            message:
                error.message ||
                "User not found.",
        });
    }
};