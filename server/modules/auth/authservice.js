const bcrypt = require("bcryptjs");

const User = require("../../models/user");
const Practitioner = require("../../models/practitioner");
const Admin = require("../../models/admin");

const findAccountByIdentifier = async (identifier) => {
  if (!identifier) return null;
  const normalized = identifier.toLowerCase().trim();
  const raw = identifier.trim();

  const user = await User.findOne({
    $or: [
      { email: normalized },
      { username: raw },
      { name: raw },
    ],
  });

  if (user) {
    return {
      account: user,
      role: user.role,
    };
  }

  const practitioner = await Practitioner.findOne({
    $or: [{ email: normalized }, { name: raw }],
  });

  if (practitioner) {
    return {
      account: practitioner,
      role: "practitioner",
    };
  }

  const admin = await Admin.findOne({
    $or: [{ email: normalized }, { name: raw }],
  });

  if (admin) {
    return {
      account: admin,
      role: "admin",
    };
  }

  return null;
};

const checkEmailExists = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.exists({
    email: normalizedEmail,
  });

  if (user) {
    return true;
  }

  const practitioner = await Practitioner.exists({
    email: normalizedEmail,
  });

  if (practitioner) {
    return true;
  }

  const admin = await Admin.exists({
    email: normalizedEmail,
  });

  return Boolean(admin);
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const createUser = async ({ name, username, email, password, bio }) => {
  const hashedPassword = await hashPassword(password);

  return User.create({
    name: (name || username || "").trim(),
    username: (username || name || "").trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    bio: (bio || "").trim(),
    role: "user",
    isApproved: true,
    approvalStatus: "approved",
    verificationStatus: "approved",
    isActive: true,
  });
};

const createPractitioner = async ({
  name,
  username,
  email,
  password,
  phone,
  specialization,
  experience,
  qualification,
  bio,
  document,
}) => {
  const hashedPassword = await hashPassword(password);

  const docObj = document
    ? {
        documentType: "certification",
        documentName: document.originalname || "License Document",
        filePath: document.path,
        originalFileName: document.originalname,
        mimeType: document.mimetype,
        verificationStatus: "pending",
      }
    : null;

  return User.create({
    name: (name || username || "").trim(),
    username: (username || name || "").trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    phone: phone || "",
    specialization: specialization || "",
    experience: experience || 0,
    qualification: qualification || "",
    bio: (bio || "").trim(),
    document: document
      ? {
          filename: document.filename,
          path: document.path,
          mimetype: document.mimetype,
          size: document.size,
          originalname: document.originalname,
        }
      : undefined,
    documents: docObj ? [docObj] : [],
    role: "practitioner",
    isApproved: false,
    approvalStatus: "pending",
    verificationStatus: "pending",
    isActive: true,
  });
};

const getCurrentUser = async (userId) => {
  let user = await User.findById(userId).select("-password");
  let role = user ? user.role : null;

  if (!user) {
    user = await Practitioner.findById(userId).select("-password");
    if (user) role = "practitioner";
  }

  if (!user) {
    user = await Admin.findById(userId).select("-password");
    if (user) role = "admin";
  }

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    _id: user._id,
    name: user.name || user.username || (user.email ? user.email.split("@")[0] : ""),
    username: user.username || user.name || (user.email ? user.email.split("@")[0] : ""),
    email: user.email,
    role: role || user.role || "user",
    bio: user.bio || "",
    specialization: user.specialization || "",
    isApproved: user.isApproved ?? (user.verificationStatus === "approved"),
    approvalStatus: user.approvalStatus || user.verificationStatus || (role === "practitioner" ? "pending" : "approved"),
    verificationStatus: user.verificationStatus || user.approvalStatus || (role === "practitioner" ? "pending" : "approved"),
    documents: user.documents || [],
  };
};

module.exports = {
  findAccountByEmail: findAccountByIdentifier,
  findAccountByIdentifier,
  checkEmailExists,
  hashPassword,
  comparePassword,
  createUser,
  createPractitioner,
  getCurrentUser,
};