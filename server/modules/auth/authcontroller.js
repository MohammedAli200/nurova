const {
  validateRegistration,
  validateLogin,
} = require("./authvalidation");

const {
  findAccountByIdentifier,
  checkEmailExists,
  comparePassword,
  createUser,
  createPractitioner,
  getCurrentUser,
} = require("./authservice");

const generateToken = require("../../utils/generatetokens");

const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password, bio } = req.body;

    const validation = validateRegistration({
      name,
      username,
      email,
      password,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const emailExists = await checkEmailExists(email);

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const user = await createUser({
      name,
      username,
      email,
      password,
      bio,
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

const registerPractitioner = async (req, res, next) => {
  try {
    const {
      name,
      username,
      email,
      password,
      phone,
      specialization,
      experience,
      qualification,
      bio,
    } = req.body;

    if (!email || !password || !specialization) {
      return res.status(400).json({
        success: false,
        message: "Email, password and specialization are required.",
      });
    }

    const emailExists = await checkEmailExists(email);

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const practitioner = await createPractitioner({
      name: name || username,
      username: username || name,
      email,
      password,
      phone,
      specialization,
      experience,
      qualification,
      bio,
      document: req.file,
    });

    return res.status(201).json({
      success: true,
      message:
        "Practitioner registered successfully. Please wait for admin approval.",
      user: {
        id: practitioner._id,
        _id: practitioner._id,
        name: practitioner.name,
        email: practitioner.email,
        role: practitioner.role,
        specialization: practitioner.specialization,
        verificationStatus: practitioner.verificationStatus,
        approvalStatus: practitioner.approvalStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const validation = validateLogin({
      email,
      username,
      password,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const identifier = email || username;
    const accountData = await findAccountByIdentifier(identifier);

    if (!accountData) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password",
      });
    }

    const { account, role } = accountData;

    const passwordMatch = await comparePassword(
      password,
      account.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password",
      });
    }

    /*
     * Practitioner verification check
     */
    if (role === "practitioner") {
      const status = account.approvalStatus || account.verificationStatus;
      if (status === "pending") {
        return res.status(403).json({
          success: false,
          message:
            "Your practitioner account is waiting for admin verification",
          verificationStatus: "pending",
          approvalStatus: "pending",
        });
      }

      if (status === "rejected") {
        return res.status(403).json({
          success: false,
          message: "Your practitioner account was rejected",
          verificationStatus: "rejected",
          approvalStatus: "rejected",
          rejectionReason: account.rejectionReason || null,
        });
      }

      if (account.isActive === false) {
        return res.status(403).json({
          success: false,
          message: "Your practitioner account is inactive",
        });
      }
    }

    /*
     * Admin/User account check
     */
    if (account.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    const token = generateToken(account);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: account._id,
        _id: account._id,
        name: account.name || account.username,
        username: account.username || account.name,
        email: account.email,
        role,
        bio: account.bio,
        specialization: account.specialization,
        ...(role === "practitioner" && {
          verificationStatus: account.verificationStatus || account.approvalStatus,
          approvalStatus: account.approvalStatus || account.verificationStatus,
        }),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await getCurrentUser(userId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  registerPractitioner,
  login,
  getMe,
};