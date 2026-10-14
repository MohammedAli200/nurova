const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authroutes");
const practitionerRoutes = require("./routes/practitionerroutes");
const adminRoutes = require("./routes/adminroutes");
const bookingRoutes = require("./modules/booking/booking.routes");
const productRoutes = require("./modules/marketplace/products/product.routes");
const practitionerProductRoutes = require("./modules/marketplace/products/practitioner.product.routes");
const orderRoutes = require("./modules/marketplace/orders/order.routes");
const cartRoutes = require("./modules/marketplace/cart/cart.routes");
const communityRoutes = require("./modules/community/community.routes");

const errorMiddleware = require("./middleware/errormiddleware");

const app = express();

/*
 * ----------------------------------------------------
 * Global Middleware
 * ----------------------------------------------------
 */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/*
 * ----------------------------------------------------
 * Uploaded Documents & Media
 * ----------------------------------------------------
 */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/*
 * ----------------------------------------------------
 * Health Check
 * ----------------------------------------------------
 */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Nurova backend API is running",
  });
});

/*
 * ----------------------------------------------------
 * API Routes
 * ----------------------------------------------------
 */

app.use("/api/auth", authRoutes);
app.use("/api/practitioners", practitionerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/products", productRoutes);
app.use("/api/practitioner/products", practitionerProductRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

/*
 * ----------------------------------------------------
 * 404 Handler
 * ----------------------------------------------------
 */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/*
 * ----------------------------------------------------
 * Global Error Handler
 * ----------------------------------------------------
 */

app.use(errorMiddleware);

module.exports = app;