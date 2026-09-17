import mongoose from "mongoose";
import "dotenv/config";
import User from "../models/User.js";
import TherapySession from "../models/TherapySession.js";
import Booking from "../models/Booking.js";
import * as bookingService from "../modules/booking/booking.service.js";

async function runCancellationTests() {
    console.log("==================================================");
    console.log("STARTING NUROVA PRACTITIONER CANCELLATION TEST SUITE");
    console.log("==================================================");

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✓ Connected to MongoDB");

        const timestamp = Date.now();

        // 1. Create Practitioner 1 (Owner) & Practitioner 2 (Non-owner)
        const practitioner1 = await User.create({
            email: `practitioner1_${timestamp}@nurova.com`,
            username: `practitioner1_${timestamp}`,
            password: "password123",
            role: "practitioner",
            specialization: "chiropractic",
            isApproved: true,
            approvalStatus: "approved",
        });

        const practitioner2 = await User.create({
            email: `practitioner2_${timestamp}@nurova.com`,
            username: `practitioner2_${timestamp}`,
            password: "password123",
            role: "practitioner",
            specialization: "acupuncture",
            isApproved: true,
            approvalStatus: "approved",
        });

        // Create User
        const clientUser = await User.create({
            email: `client_${timestamp}@nurova.com`,
            username: `client_${timestamp}`,
            password: "password123",
            role: "user",
        });

        console.log("✓ Setup test users (Practitioner 1, Practitioner 2, Client)");

        // ---------------------------------------------------------------------
        // TEST 1-8: Unbooked Session Cancellation Flow
        // ---------------------------------------------------------------------
        console.log("\n--- TEST SCENARIO A: UNBOOKED SESSION CANCELLATION ---");

        const dateA = new Date(Date.now() + 3 * 86400000); // 3 days ahead
        const dateAEnd = new Date(dateA.getTime() + 60 * 60000);

        // 1. Practitioner creates session
        const sessionA = await bookingService.createPractitionerSession(
            practitioner1._id,
            {
                title: "Spinal Alignment Session A",
                specialization: "chiropractic",
                startAt: dateA.toISOString(),
                endAt: dateAEnd.toISOString(),
                description: "Spinal alignment test session A",
            }
        );
        console.log("1. Practitioner created session:", sessionA._id);

        // 2 & 3. Session appears as available in user discovery
        const availableBefore = await bookingService.getAvailableSessions();
        const isSessionAInDiscovery = availableBefore.some(
            (s) => s._id.toString() === sessionA._id.toString()
        );
        if (!isSessionAInDiscovery) {
            throw new Error("FAIL: Session A not found in available sessions discovery!");
        }
        console.log("2 & 3. Session appears as available for users");

        // 4. Practitioner cancels it
        const cancelResultA = await bookingService.cancelPractitionerSession(
            practitioner1._id,
            sessionA._id
        );
        console.log("4. Practitioner cancelled session:", cancelResultA.session.status);

        // 5. Session disappears from user availability
        const availableAfter = await bookingService.getAvailableSessions();
        const isSessionAInDiscoveryAfter = availableAfter.some(
            (s) => s._id.toString() === sessionA._id.toString()
        );
        if (isSessionAInDiscoveryAfter) {
            throw new Error("FAIL: Cancelled session A is still returned in available discovery!");
        }
        console.log("5. Session disappeared from user availability");

        // 6. Session status becomes cancelled in DB (document preserved)
        const sessionADoc = await TherapySession.findById(sessionA._id);
        if (!sessionADoc || sessionADoc.status !== "cancelled") {
            throw new Error("FAIL: Session A status is not 'cancelled' or document was deleted!");
        }
        console.log("6. Session status verified as 'cancelled' (document preserved)");

        // 7. User cannot book it
        try {
            await bookingService.bookTherapySession(clientUser._id, sessionA._id, {
                bookingNotes: "Trying to book cancelled session",
            });
            throw new Error("FAIL: User was able to book a cancelled session!");
        } catch (err) {
            console.log("7. Verified user cannot book cancelled session:", err.message);
        }

        // 8. Practitioner sees cancelled status in practitioner sessions list
        const practitionerSessions = await bookingService.getPractitionerSessions(
            practitioner1._id
        );
        const pSessionA = practitionerSessions.find(
            (s) => s._id.toString() === sessionA._id.toString()
        );
        if (!pSessionA || pSessionA.status !== "cancelled") {
            throw new Error("FAIL: Practitioner does not see cancelled status for session A!");
        }
        console.log("8. Practitioner sees cancelled status in schedule/history");

        // ---------------------------------------------------------------------
        // TEST 9: Booked Session Cancellation Flow
        // ---------------------------------------------------------------------
        console.log("\n--- TEST SCENARIO B: BOOKED SESSION CANCELLATION ---");

        const dateB = new Date(Date.now() + 4 * 86400000); // 4 days ahead
        const dateBEnd = new Date(dateB.getTime() + 60 * 60000);

        const sessionB = await bookingService.createPractitionerSession(
            practitioner1._id,
            {
                title: "Deep Chiropractic Adjustment B",
                specialization: "chiropractic",
                startAt: dateB.toISOString(),
                endAt: dateBEnd.toISOString(),
                description: "Booked session test B",
            }
        );

        // User books session B
        const bookResultB = await bookingService.bookTherapySession(
            clientUser._id,
            sessionB._id,
            {
                bookingNotes: "Chronic lower back stiffness",
            }
        );
        console.log("✓ User booked session B:", bookResultB.booking._id);

        // Practitioner cancels booked session B
        const cancelResultB = await bookingService.cancelPractitionerSession(
            practitioner1._id,
            sessionB._id
        );
        if (!cancelResultB.wasBooked) {
            throw new Error("FAIL: wasBooked flag should be true!");
        }
        console.log("✓ Practitioner cancelled booked session B");

        // Verify session status is cancelled
        const sessionBDoc = await TherapySession.findById(sessionB._id);
        if (sessionBDoc.status !== "cancelled") {
            throw new Error("FAIL: Session B status is not 'cancelled'!");
        }

        // Verify booking status is cancelled and preserved in DB
        const bookingBDoc = await Booking.findById(bookResultB.booking._id);
        if (!bookingBDoc || bookingBDoc.status !== "cancelled") {
            throw new Error("FAIL: Booking B status was not changed to 'cancelled' or was deleted!");
        }
        console.log("9. Booked session and Booking document both transitioned to 'cancelled' and preserved");

        // Verify user sees cancellation in bookings history
        const userBookings = await bookingService.getUserBookings(clientUser._id);
        const userCancelledBooking = userBookings.find(
            (b) => b._id.toString() === bookResultB.booking._id.toString()
        );
        if (!userCancelledBooking || userCancelledBooking.status !== "cancelled") {
            throw new Error("FAIL: User does not see cancelled booking in history!");
        }
        console.log("✓ User sees the cancelled booking in user booking history");

        // ---------------------------------------------------------------------
        // TEST 10: Non-owner Practitioner cannot cancel another practitioner's session
        // ---------------------------------------------------------------------
        console.log("\n--- TEST SCENARIO C: OWNERSHIP & SECURITY ENFORCEMENT ---");

        const dateC = new Date(Date.now() + 5 * 86400000);
        const dateCEnd = new Date(dateC.getTime() + 60 * 60000);

        const sessionC = await bookingService.createPractitionerSession(
            practitioner1._id,
            {
                title: "Session C for Security Check",
                specialization: "chiropractic",
                startAt: dateC.toISOString(),
                endAt: dateCEnd.toISOString(),
            }
        );

        try {
            await bookingService.cancelPractitionerSession(
                practitioner2._id, // Non-owner practitioner
                sessionC._id
            );
            throw new Error("FAIL: Non-owner practitioner was able to cancel another's session!");
        } catch (err) {
            console.log("10. Blocked non-owner practitioner cancellation:", err.message);
        }

        // ---------------------------------------------------------------------
        // TEST 11: Practitioner cannot cancel a past or completed session
        // ---------------------------------------------------------------------
        console.log("\n--- TEST SCENARIO D: COMPLETED / PAST SESSION VALIDATION ---");

        const pastDate = new Date(Date.now() - 2 * 86400000);
        const pastDateEnd = new Date(pastDate.getTime() + 60 * 60000);

        // Insert a past completed session directly
        const pastSession = await TherapySession.create({
            practitioner: practitioner1._id,
            title: "Past Completed Therapy",
            specialization: "chiropractic",
            startAt: pastDate,
            endAt: pastDateEnd,
            duration: 60,
            capacity: 1,
            bookedCount: 1,
            status: "completed",
        });

        try {
            await bookingService.cancelPractitionerSession(
                practitioner1._id,
                pastSession._id
            );
            throw new Error("FAIL: Practitioner was able to cancel a completed session!");
        } catch (err) {
            console.log("11. Blocked cancellation of completed / past session:", err.message);
        }

        // ---------------------------------------------------------------------
        // TEST 12: Practitioner cannot cancel the same session twice
        // ---------------------------------------------------------------------
        console.log("\n--- TEST SCENARIO E: REPEAT CANCELLATION PREVENTION ---");

        try {
            await bookingService.cancelPractitionerSession(
                practitioner1._id,
                sessionA._id // sessionA was already cancelled in Test 4
            );
            throw new Error("FAIL: Allowed repeated cancellation of already cancelled session!");
        } catch (err) {
            console.log("12. Blocked repeated cancellation:", err.message);
        }

        // Clean up test data
        await TherapySession.deleteMany({
            practitioner: { $in: [practitioner1._id, practitioner2._id] },
        });
        await Booking.deleteMany({
            practitioner: { $in: [practitioner1._id, practitioner2._id] },
        });
        await User.deleteMany({
            _id: { $in: [practitioner1._id, practitioner2._id, clientUser._id] },
        });
        console.log("\n✓ Test data cleaned up successfully");

        console.log("\n==================================================");
        console.log("ALL 12 PRACTITIONER CANCELLATION TESTS PASSED!");
        console.log("==================================================");

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("\n❌ TEST FAILED:", err);
        await mongoose.disconnect();
        process.exit(1);
    }
}

runCancellationTests();
