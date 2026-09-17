import mongoose from "mongoose";
import TherapySession from "../../models/TherapySession.js";
import Booking from "../../models/Booking.js";
import User from "../../models/User.js";

/**
 * Check if a practitioner is verified and approved
 */
const verifyPractitionerApproval = async (practitionerId) => {
    const practitioner = await User.findById(practitionerId);
    if (!practitioner || practitioner.role !== "practitioner") {
        throw { status: 404, message: "Practitioner not found." };
    }

    const isApproved =
        practitioner.approvalStatus === "approved" ||
        practitioner.isApproved === true;

    if (!isApproved) {
        throw {
            status: 403,
            message:
                "Practitioner account is pending or not approved for scheduling.",
        };
    }

    return practitioner;
};

/* =========================================================================
   PRACTITIONER SERVICES
   ========================================================================= */

/**
 * Schedule a new therapy session for an approved practitioner
 */
export const createPractitionerSession = async (
    practitionerId,
    sessionData
) => {
    await verifyPractitionerApproval(practitionerId);

    const {
        title,
        description,
        specialization,
        startAt,
        endAt,
        duration: customDuration,
    } = sessionData;

    if (!title || !specialization || !startAt || !endAt) {
        throw {
            status: 400,
            message:
                "Title, specialization, start time, and end time are required.",
        };
    }

    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw { status: 400, message: "Invalid date or time format." };
    }

    if (startDate <= new Date()) {
        throw {
            status: 400,
            message: "Therapy session start time cannot be in the past.",
        };
    }

    if (endDate <= startDate) {
        throw {
            status: 400,
            message: "End time must be after the start time.",
        };
    }

    // Calculate duration in minutes if not specified
    const calculatedDuration = Math.round(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60)
    );
    const duration = customDuration ? Number(customDuration) : calculatedDuration;

    if (duration < 15) {
        throw {
            status: 400,
            message: "Session duration must be at least 15 minutes.",
        };
    }

    // Check for overlapping active sessions for this practitioner
    const overlappingSession = await TherapySession.findOne({
        practitioner: practitionerId,
        status: { $ne: "cancelled" },
        $or: [
            {
                startAt: { $lt: endDate },
                endAt: { $gt: startDate },
            },
        ],
    });

    if (overlappingSession) {
        throw {
            status: 400,
            message:
                "You already have a scheduled therapy session overlapping with this time slot.",
        };
    }

    const newSession = await TherapySession.create({
        practitioner: practitionerId,
        title: title.trim(),
        description: description ? description.trim() : "",
        specialization,
        startAt: startDate,
        endAt: endDate,
        duration,
        capacity: 1,
        bookedCount: 0,
        status: "available",
    });

    return newSession;
};

/**
 * Get all scheduled sessions for a practitioner (calendar & list)
 */
export const getPractitionerSessions = async (practitionerId, filters = {}) => {
    const { status, fromDate, toDate } = filters;

    const query = { practitioner: practitionerId };

    if (status) {
        query.status = status;
    }

    if (fromDate || toDate) {
        query.startAt = {};
        if (fromDate) query.startAt.$gte = new Date(fromDate);
        if (toDate) query.startAt.$lte = new Date(toDate);
    }

    const sessions = await TherapySession.find(query).sort({ startAt: 1 });

    // Attach booking information for booked sessions
    const sessionIds = sessions
        .filter((s) => s.status === "booked")
        .map((s) => s._id);

    const bookings = await Booking.find({
        session: { $in: sessionIds },
        status: "confirmed",
    }).populate("user", "username email bio");

    const bookingMap = new Map();
    bookings.forEach((b) => {
        bookingMap.set(b.session.toString(), b);
    });

    const sessionsWithBookings = sessions.map((session) => {
        const sessionObj = session.toObject();
        if (bookingMap.has(session._id.toString())) {
            sessionObj.booking = bookingMap.get(session._id.toString());
        }
        return sessionObj;
    });

    return sessionsWithBookings;
};

/**
 * Get all client bookings for a practitioner
 */
export const getPractitionerBookings = async (practitionerId, filters = {}) => {
    const { status } = filters;

    const query = { practitioner: practitionerId };
    if (status) {
        query.status = status;
    }

    const bookings = await Booking.find(query)
        .populate("user", "username email bio")
        .populate("session")
        .sort({ createdAt: -1 });

    return bookings;
};

/**
 * Cancel a scheduled session (practitioner)
 */
export const cancelPractitionerSession = async (
    practitionerId,
    sessionId
) => {
    const session = await TherapySession.findById(sessionId);

    if (!session) {
        throw { status: 404, message: "Therapy session not found." };
    }

    // Verify ownership
    if (session.practitioner.toString() !== practitionerId.toString()) {
        throw {
            status: 403,
            message: "Access denied. You can only cancel sessions that you created.",
        };
    }

    if (session.status === "cancelled") {
        throw { status: 400, message: "This therapy session is already cancelled." };
    }

    if (session.status === "completed") {
        throw { status: 400, message: "Cannot cancel a completed therapy session." };
    }

    if (new Date(session.startAt) <= new Date()) {
        throw { status: 400, message: "Cannot cancel a past therapy session." };
    }

    const wasBooked = session.status === "booked";

    session.status = "cancelled";
    await session.save();

    let affectedBooking = null;

    // If there was an active confirmed booking, mark it as cancelled without deleting
    if (wasBooked) {
        affectedBooking = await Booking.findOneAndUpdate(
            { session: sessionId, status: "confirmed" },
            { $set: { status: "cancelled" } },
            { new: true }
        ).populate("user", "username email bio");
    }

    return {
        session,
        wasBooked,
        affectedBooking,
    };
};

/* =========================================================================
   USER DISCOVERY & BOOKING SERVICES
   ========================================================================= */

/**
 * Get all approved, verified practitioners for discovery
 */
export const getVerifiedPractitioners = async (filters = {}) => {
    const { search, specialization } = filters;

    const query = {
        role: "practitioner",
        $or: [{ approvalStatus: "approved" }, { isApproved: true }],
    };

    if (specialization) {
        query.specialization = specialization;
    }

    if (search && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        query.$and = [
            {
                $or: [
                    { username: regex },
                    { email: regex },
                    { bio: regex },
                ],
            },
        ];
    }

    const practitioners = await User.find(query)
        .select("-password")
        .sort({ createdAt: -1 });

    // Aggregate available future session counts for each practitioner
    const now = new Date();
    const practitionerIds = practitioners.map((p) => p._id);

    const availableCounts = await TherapySession.aggregate([
        {
            $match: {
                practitioner: { $in: practitionerIds },
                status: "available",
                startAt: { $gt: now },
            },
        },
        {
            $group: {
                _id: "$practitioner",
                count: { $sum: 1 },
            },
        },
    ]);

    const countMap = new Map();
    availableCounts.forEach((item) => {
        countMap.set(item._id.toString(), item.count);
    });

    return practitioners.map((p) => {
        const obj = p.toObject();
        obj.availableSessionCount = countMap.get(p._id.toString()) || 0;
        return obj;
    });
};

/**
 * Get practitioner profile and upcoming available sessions
 */
export const getPractitionerProfile = async (practitionerId) => {
    const practitioner = await verifyPractitionerApproval(practitionerId);

    const now = new Date();
    const availableSessions = await TherapySession.find({
        practitioner: practitionerId,
        status: "available",
        startAt: { $gt: now },
    }).sort({ startAt: 1 });

    const profileObj = practitioner.toObject();
    delete profileObj.password;

    return {
        practitioner: profileObj,
        availableSessions,
    };
};

/**
 * Get available sessions with optional date and specialization filtering
 */
export const getAvailableSessions = async (filters = {}) => {
    const { practitionerId, specialization, date } = filters;

    const now = new Date();
    const query = {
        status: "available",
        startAt: { $gt: now },
    };

    if (practitionerId) {
        query.practitioner = practitionerId;
    }

    if (specialization) {
        query.specialization = specialization;
    }

    if (date) {
        // Find sessions on the given calendar date in UTC / local bounds
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        query.startAt = {
            $gte: startOfDay > now ? startOfDay : now,
            $lte: endOfDay,
        };
    }

    const sessions = await TherapySession.find(query)
        .populate("practitioner", "username email specialization bio")
        .sort({ startAt: 1 });

    return sessions;
};

/**
 * Get single session by ID
 */
export const getSessionById = async (sessionId, requestingUser) => {
    const session = await TherapySession.findById(sessionId).populate(
        "practitioner",
        "username email specialization bio isApproved approvalStatus"
    );

    if (!session) {
        throw { status: 404, message: "Therapy session not found." };
    }

    const sessionObj = session.toObject();

    // If session has an associated booking (confirmed or cancelled), provide booking context to authorized users
    const booking = await Booking.findOne({
        session: sessionId,
    }).populate("user", "username email bio");

    if (booking) {
        const isOwnerPractitioner =
            requestingUser &&
            session.practitioner &&
            requestingUser._id.toString() ===
                session.practitioner._id.toString();

        const isBookedUser =
            requestingUser &&
            booking.user &&
            requestingUser._id.toString() ===
                booking.user._id.toString();

        if (isOwnerPractitioner || isBookedUser || requestingUser?.role === "admin") {
            sessionObj.booking = booking;
        }
    }

    return sessionObj;
};

/**
 * Book a therapy session with ATOMIC concurrency lock
 */
export const bookTherapySession = async (
    userId,
    sessionId,
    bookingData = {}
) => {
    const { bookingNotes = "" } = bookingData;

    const user = await User.findById(userId);
    if (!user) {
        throw { status: 401, message: "User account not found." };
    }

    // Step 1: Pre-fetch session to validate practitioner and ownership
    const targetSession = await TherapySession.findById(sessionId);
    if (!targetSession) {
        throw { status: 404, message: "Therapy session not found." };
    }

    if (targetSession.practitioner.toString() === userId.toString()) {
        throw {
            status: 400,
            message: "Practitioners cannot book their own therapy sessions.",
        };
    }

    // Verify practitioner is approved
    await verifyPractitionerApproval(targetSession.practitioner);

    if (targetSession.startAt <= new Date()) {
        throw {
            status: 400,
            message: "Cannot book a session that has already passed.",
        };
    }

    // Check if user is already booked for this exact session
    const existingUserBooking = await Booking.findOne({
        session: sessionId,
        user: userId,
        status: "confirmed",
    });

    if (existingUserBooking) {
        throw {
            status: 400,
            message: "You have already booked this therapy session.",
        };
    }

    // Step 2: ATOMIC LOCK VIA findOneAndUpdate
    // Guarantees only ONE booking succeeds even if multiple concurrent requests hit simultaneously
    const lockedSession = await TherapySession.findOneAndUpdate(
        {
            _id: sessionId,
            status: "available",
            bookedCount: { $lt: 1 },
            startAt: { $gt: new Date() },
        },
        {
            $set: { status: "booked" },
            $inc: { bookedCount: 1 },
        },
        { new: true }
    );

    if (!lockedSession) {
        throw {
            status: 409,
            message:
                "This therapy session has already been booked by another client. Please select another available session.",
        };
    }

    // Step 3: Create confirmed Booking record
    try {
        const booking = await Booking.create({
            session: sessionId,
            user: userId,
            practitioner: lockedSession.practitioner,
            status: "confirmed",
            bookingNotes: bookingNotes.trim(),
        });

        await booking.populate("practitioner", "username email specialization");
        await booking.populate("session");

        return {
            booking,
            session: lockedSession,
        };
    } catch (error) {
        // Rollback atomic lock if booking record creation fails
        await TherapySession.findByIdAndUpdate(sessionId, {
            $set: { status: "available" },
            $inc: { bookedCount: -1 },
        });

        throw {
            status: 500,
            message: "Failed to confirm booking. Please try again.",
        };
    }
};

/**
 * Get all bookings for a user
 */
export const getUserBookings = async (userId, filters = {}) => {
    const { status } = filters;

    const query = { user: userId };
    if (status) {
        query.status = status;
    }

    const bookings = await Booking.find(query)
        .populate({
            path: "session",
            populate: {
                path: "practitioner",
                select: "username email specialization bio",
            },
        })
        .populate("practitioner", "username email specialization bio")
        .sort({ createdAt: -1 });

    return bookings;
};

/**
 * Cancel a user booking
 */
export const cancelUserBooking = async (userId, bookingId) => {
    const booking = await Booking.findOne({
        _id: bookingId,
        user: userId,
        status: "confirmed",
    });

    if (!booking) {
        throw {
            status: 404,
            message: "Active booking not found or already cancelled.",
        };
    }

    booking.status = "cancelled";
    await booking.save();

    // Release the session back to available if it is still in the future
    const session = await TherapySession.findById(booking.session);
    if (session && session.startAt > new Date()) {
        session.status = "available";
        session.bookedCount = Math.max(0, session.bookedCount - 1);
        await session.save();
    }

    return booking;
};

/**
 * Get summary dashboard metrics and upcoming items for user
 */
export const getUserDashboardMetrics = async (userId) => {
    const now = new Date();

    const upcomingBookings = await Booking.find({
        user: userId,
        status: "confirmed",
    })
        .populate({
            path: "session",
            match: { startAt: { $gt: now } },
            populate: {
                path: "practitioner",
                select: "username email specialization bio",
            },
        })
        .populate("practitioner", "username email specialization bio")
        .sort({ createdAt: -1 })
        .limit(5);

    // Filter out null sessions (past ones)
    const validUpcoming = upcomingBookings.filter((b) => b.session !== null);

    const totalBookingsCount = await Booking.countDocuments({ user: userId });
    const verifiedPractitionersCount = await User.countDocuments({
        role: "practitioner",
        $or: [{ approvalStatus: "approved" }, { isApproved: true }],
    });

    return {
        upcomingBookings: validUpcoming,
        totalBookingsCount,
        verifiedPractitionersCount,
    };
};
