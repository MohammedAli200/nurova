import express from "express";

import {
    dashboard,
    practitioners,
    practitionerDetails,
    approve,
    reject,
    users,
} from "./admin.controller.js";

import { authenticate } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authenticate);
router.use(requireRole("admin"));

router.get(
    "/dashboard",
    dashboard
);

router.get(
    "/practitioners",
    practitioners
);

router.get(
    "/practitioners/:id",
    practitionerDetails
);

router.patch(
    "/practitioners/:id/approve",
    approve
);

router.patch(
    "/practitioners/:id/reject",
    reject
);

router.get(
    "/users",
    users
);

export default router;