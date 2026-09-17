import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";

import authRoutes from "./modules/auth/auth.routes.js";
import { seedAdmin } from "./utils/seedAdmin.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import bookingRoutes from "./modules/booking/booking.routes.js";


const app = express();

const PORT = process.env.PORT || 5001;


// Middleware
app.use(helmet());

app.use(
    cors({
        origin:
            process.env.CLIENT_URL ||
            "http://localhost:5173",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));


// Routes
app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/booking",
    bookingRoutes
);

app.use(
    "/uploads",
    express.static("uploads")
);

// Start server
const startServer = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected"
        );

        // Create admin account if it doesn't exist
        await seedAdmin();

        app.listen(PORT, () => {
            console.log(
                `Server running on port ${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Server startup error:",
            error
        );

        process.exit(1);
    }
};


startServer();