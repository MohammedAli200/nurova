import express from "express";

import {
    registerUser,
    registerPractitioner,
    login,
    getCurrentUser,
} from "./auth.controller.js";

import { authenticate } from "../../middleware/authMiddleware.js";

import {
    practitionerUpload,
} from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
    "/register/user",
    registerUser
);

router.post(
    "/register/practitioner",
    practitionerUpload.single("document"),
    registerPractitioner
);

router.post(
    "/login",
    login
);

router.get(
    "/me",
    authenticate,
    getCurrentUser
);

export default router;