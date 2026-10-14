const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return false;
  }

  return password.length >= 6;
};

const validateRegistration = ({ name, username, email, password }) => {
  const errors = {};
  const displayName = name || username;

  if (!displayName || typeof displayName !== "string" || !displayName.trim()) {
    errors.name = "Name or username is required";
  }

  if (!validateEmail(email)) {
    errors.email = "A valid email is required";
  }

  if (!validatePassword(password)) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateLogin = ({ email, username, password }) => {
  const errors = {};
  const identifier = email || username;

  if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
    errors.email = "A valid email or username is required";
  }

  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRegistration,
  validateLogin,
};