const isAuthenticated = require("../middleware/isAuthenticated");
const Booking = require("../models/Booking");
const Ride = require("../models/Ride");
const express = require("express");
const router = express.Router();

// =========================
// REQUEST RIDE
// =========================
router.post("/request/:rideId", isAuthenticated, async (req, res) => {
  try {
    const riderId = req.user.id;
    const rideId = req.params.rideId;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // ❗ prevent self-booking
    if (ride.driver.toString() === riderId) {
      return res.status(400).json({
        message: "You cannot book your own ride",
      });
    }

    // ❗ prevent duplicate
    const existing = await Booking.findOne({
      ride: rideId,
      rider: riderId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already requested",
      });
    }

    // ✅ CORRECT CREATION
    const booking = new Booking({
      ride: ride._id,       // ✅ IMPORTANT
      rider: riderId,       // ✅ IMPORTANT
      driver: ride.driver,  // ✅ IMPORTANT
    });

    await booking.save();

    res.status(201).json({
      message: "Request sent",
      booking,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Request failed" });
  }
});

// Get all bookings (admin view)
router.get("/all", async (req, res) => {
  const bookings = await Booking.find()
    .populate("ride")
    .populate("driver", "email")
    .populate("rider", "email");

  res.json(bookings);
});
// =========================
// GET DRIVER BOOKINGS
// =========================
router.get("/driver", isAuthenticated, async (req, res) => {
  try {
    const driverId = req.user.id;

    const bookings = await Booking.find({ driver: driverId })
      .populate("rider", "email")
      .populate("ride");

    res.json(bookings);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});
// ACCEPT REQUEST
router.patch("/accept/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("ride");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "accepted";
    await booking.save();

    res.json({ message: "Ride accepted" });
  } catch (err) {
    res.status(500).json({ message: "Error accepting ride" });
  }
});

// REJECT REQUEST
router.patch("/reject/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "rejected";
    await booking.save();

    res.json({ message: "Ride rejected" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting ride" });
  }
});
// =========================
// GET BOOKING STATUS
// =========================
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      status: booking.status,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
});
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("rider", "email")
      .populate("driver", "email")
      .populate({
        path: "ride",
        select: "from to date price",
      });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
});
// =========================
// GET FULL BOOKING DETAILS
// =========================
router.get("/details/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("rider", "email")
      .populate("driver", "email")
      .populate({
        path: "ride",
        select: "from to date price",
      });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
});
module.exports = router;