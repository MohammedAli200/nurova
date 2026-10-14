const User = require("../models/user");
const Practitioner = require("../models/practitioner");

/**
 * Universal Practitioner Identity Resolver
 *
 * Resolves practitioner identity from either the User collection (role="practitioner")
 * or the legacy Practitioner collection. Handles missing names, provides sensible fallbacks,
 * ensures password hashes are never leaked, and returns standardized practitioner fields.
 */
async function resolvePractitioner(practitionerId) {
  if (!practitionerId) return null;

  const raw = practitionerId;
  const pId = practitionerId._id || practitionerId.id || practitionerId;

  let doc = null;

  // 1. Try finding in User collection if not already a full object
  if (
    typeof raw === "object" &&
    raw.email &&
    (raw.role === "practitioner" || raw.specialization)
  ) {
    doc = { ...raw };
  } else {
    doc = await User.findById(pId).select("-password").lean();
  }

  // 2. If not found or lacks specialization/name, try Practitioner collection
  if (!doc || !doc.specialization) {
    const prDoc = await Practitioner.findById(pId).select("-password").lean();
    if (prDoc) {
      doc = { ...prDoc, role: "practitioner" };
    }
  }

  // 3. If found but incomplete (e.g. missing name or specialization), check matching Practitioner by email
  if (doc && (!doc.name || !doc.specialization) && doc.email) {
    const matchingPr = await Practitioner.findOne({
      email: doc.email.toLowerCase(),
    })
      .select("-password")
      .lean();

    if (matchingPr) {
      doc.name = doc.name || matchingPr.name;
      doc.specialization = doc.specialization || matchingPr.specialization;
      doc.bio = doc.bio || matchingPr.bio;
      doc.experience = doc.experience || matchingPr.experience;
      doc.qualification = doc.qualification || matchingPr.qualification;
      doc.verificationStatus =
        doc.verificationStatus || matchingPr.verificationStatus;
    }
  }

  // Fallback if record truly does not exist
  if (!doc) {
    return {
      _id: pId,
      id: pId,
      name: "Practitioner",
      displayName: "Practitioner",
      email: "",
      specialization: "Alternative Therapy",
      profileImage: null,
      avatar: null,
      isApproved: false,
      approvalStatus: "pending",
      verificationStatus: "pending",
      verified: false,
    };
  }

  // Clean and derive sensible practitioner name
  let cleanName = (doc.name || "").trim();
  if (!cleanName && doc.username) {
    cleanName = doc.username.trim();
  }
  if (!cleanName && doc.email) {
    const emailPrefix = doc.email.split("@")[0].replace(/[._-]/g, " ");
    cleanName =
      emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  }
  if (!cleanName) {
    cleanName = "Holistic Practitioner";
  }

  // Determine verification status
  const isVerified = Boolean(
    doc.approvalStatus === "approved" ||
      doc.verificationStatus === "approved" ||
      doc.isApproved === true
  );

  // Formatted title: "Dr. [Name]" if verified and not already starting with Dr.
  const hasDrPrefix =
    cleanName.toLowerCase().startsWith("dr.") ||
    cleanName.toLowerCase().startsWith("dr ");
  const displayName = isVerified
    ? hasDrPrefix
      ? cleanName
      : `Dr. ${cleanName}`
    : cleanName;

  const profileImage =
    doc.profileImage || doc.avatar || doc.image || null;

  return {
    _id: doc._id || pId,
    id: doc._id || pId,
    name: cleanName,
    displayName,
    username: doc.username || cleanName,
    email: doc.email || "",
    specialization: doc.specialization || "Alternative Therapy Specialist",
    bio: doc.bio || "",
    experience: doc.experience || 0,
    qualification: doc.qualification || "",
    profileImage,
    avatar: profileImage,
    isApproved: Boolean(doc.isApproved),
    approvalStatus:
      doc.approvalStatus || (isVerified ? "approved" : "pending"),
    verificationStatus:
      doc.verificationStatus || (isVerified ? "approved" : "pending"),
    verified: isVerified,
  };
}

module.exports = resolvePractitioner;
