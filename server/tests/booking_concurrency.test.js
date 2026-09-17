import mongoose from "mongoose";
import "dotenv/config";
import User from "../models/User.js";
import TherapySession from "../models/TherapySession.js";
import Booking from "../models/Booking.js";
import * as bookingService from "../modules/booking/booking.service.js";

async function runTests() {
    console.log("==================================================");
    console.log("STARTING NUROVA THERAPY BOOKING & CONCURRENCY TEST");
    console.log("==================================================");

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✓ Connected to MongoDB");

        // 1. Create Test Practitioner (Approved)
        const timestamp = Date.now();
        const practitionerEmail = `test_doc_${timestamp}@nurova.com`;
        const testPractitioner = await User.create({
            email: practitionerEmail,
            username: `doc_${timestamp}`,
            password: "password123",
            role: "practitioner",
            specialization: "physiotherapy",
            isApproved: true,
            approvalStatus: "approved",
        });
        console.log("✓ Created approved test practitioner:", testPractitioner.email);

        // 2. Create Unapproved Practitioner to verify exclusion
        const pendingPractitioner = await User.create({
            email: `pending_doc_${timestamp}@nurova.com`,
            username: `pending_${timestamp}`,
            password: "password123",
            role: "practitioner",
            specialization: "acupuncture",
            isApproved: false,
            approvalStatus: "pending",
        });
        console.log("✓ Created pending test practitioner:", pendingPractitioner.email);

        // 3. Verify Discovery excludes pending practitioner
        const discovered = await bookingService.getVerifiedPractitioners();
        const pendingFound = discovered.some(
            (p) => p._id.toString() === pendingPractitioner._id.toString()
        );
        if (pendingFound) {
            throw new Error("FAIL: Pending practitioner was returned in discovery!");
        }
        console.log("✓ Verified discovery ONLY returns approved practitioners");

        // 4. Create Therapy Session for Approved Practitioner
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2);
        tomorrow.setHours(10, 0, 0, 0);

        const endTomorrow = new Date(tomorrow);
        endTomorrow.setHours(11, 0, 0, 0);

        const session = await bookingService.createPractitionerSession(
            testPractitioner._id,
            {
                title: "Holistic Spine & Mobility Alignment",
                specialization: "physiotherapy",
                startAt: tomorrow.toISOString(),
                endAt: endTomorrow.toISOString(),
                description: "Deep tissue restorative physiotherapy session.",
            }
        );
        console.log("✓ Created therapy session:", session._id, session.title);

        // 5. Verify overlapping session is blocked
        try {
            await bookingService.createPractitionerSession(testPractitioner._id, {
                title: "Conflicting Session",
                specialization: "physiotherapy",
                startAt: new Date(tomorrow.getTime() + 15 * 60000).toISOString(),
                endAt: new Date(endTomorrow.getTime() + 15 * 60000).toISOString(),
            });
            throw new Error("FAIL: Overlapping session should have been rejected!");
        } catch (err) {
            console.log("✓ Successfully prevented overlapping session:", err.message);
        }

        // 6. Create Two Distinct Users for Concurrency Race Condition Test
        const userA = await User.create({
            email: `user_a_${timestamp}@nurova.com`,
            username: `usera_${timestamp}`,
            password: "password123",
            role: "user",
        });

        const userB = await User.create({
            email: `user_b_${timestamp}@nurova.com`,
            username: `userb_${timestamp}`,
            password: "password123",
            role: "user",
        });
        console.log("✓ Created User A and User B for concurrency test");

        // 7. CONCURRENCY RACE CONDITION TEST
        console.log("▶ Launching SIMULTANEOUS booking requests for User A and User B on Session:", session._id);
        
        const [resultA, resultB] = await Promise.allSettled([
            bookingService.bookTherapySession(userA._id, session._id, {
                bookingNotes: "User A notes",
            }),
            bookingService.bookTherapySession(userB._id, session._id, {
                bookingNotes: "User B notes",
            }),
        ]);

        const successfulBookings = [resultA, resultB].filter(
            (r) => r.status === "fulfilled"
        );
        const failedBookings = [resultA, resultB].filter(
            (r) => r.status === "rejected"
        );

        console.log(`- Success count: ${successfulBookings.length}`);
        console.log(`- Rejected count: ${failedBookings.length}`);

        if (successfulBookings.length !== 1 || failedBookings.length !== 1) {
            throw new Error(
                `CONCURRENCY FAILURE! Expected exactly 1 success and 1 rejection, got ${successfulBookings.length} and ${failedBookings.length}`
            );
        }

        console.log("✓ Rejection message received:", failedBookings[0].reason.message);

        // 8. Verify Database State
        const updatedSession = await TherapySession.findById(session._id);
        console.log("✓ Updated session status:", updatedSession.status, "bookedCount:", updatedSession.bookedCount);

        if (updatedSession.status !== "booked" || updatedSession.bookedCount !== 1) {
            throw new Error("Session state is inconsistent!");
        }

        const confirmedBookings = await Booking.find({
            session: session._id,
            status: "confirmed",
        });
        console.log("✓ Confirmed bookings count in DB:", confirmedBookings.length);

        if (confirmedBookings.length !== 1) {
            throw new Error("Multiple confirmed bookings found in DB!");
        }

        // 9. Verify Session is NO LONGER in Available Sessions
        const availableSessionsAfter = await bookingService.getAvailableSessions({
            practitionerId: testPractitioner._id,
        });
        const stillAvailable = availableSessionsAfter.some(
            (s) => s._id.toString() === session._id.toString()
        );
        if (stillAvailable) {
            throw new Error("Booked session is still returned as available!");
        }
        console.log("✓ Verified session immediately disappeared from available listings");

        // Cleanup test artifacts
        await Booking.deleteMany({ session: session._id });
        await TherapySession.deleteMany({ practitioner: testPractitioner._id });
        await User.deleteMany({
            _id: {
                $in: [
                    testPractitioner._id,
                    pendingPractitioner._id,
                    userA._id,
                    userB._id,
                ],
            },
        });
        console.log("✓ Cleaned up test database records");

        console.log("==================================================");
        console.log("ALL THERAPY BOOKING & CONCURRENCY TESTS PASSED! 🎉");
        console.log("==================================================");

        process.exit(0);
    } catch (err) {
        console.error("TEST FAILED WITH ERROR:", err);
        process.exit(1);
    }
}

runTests();
