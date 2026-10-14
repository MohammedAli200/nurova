const jwt = require("jsonwebtoken");

const generateToken = (userOrId, role) => {
    let id;
    let userRole;
    let email;

    if (userOrId && typeof userOrId === "object") {
        id = (userOrId._id || userOrId.id)?.toString();
        userRole = userOrId.role;
        email = userOrId.email;
    } else {
        id = userOrId?.toString();
        userRole = role;
    }

    if (!id) {
        throw new Error("User ID is required to generate token");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(
        {
            id,
            _id: id,
            role: userRole,
            ...(email && { email }),
        },
        secret,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken,
};