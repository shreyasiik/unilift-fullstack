const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride");
const isAuthenticated = require("../middleware/isAuthenticated");

// =========================
// CREATE RIDE
// =========================
router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const { from, to, date, seatsAvailable, price } = req.body;

    const driverId = req.user.id;

    console.log("Create ride request:", {
      from,
      to,
      date,
      seatsAvailable,
      price,
      driverId,
    });

    // VALIDATION
    if (!from || !to || !date || !seatsAvailable || !price) {
      return res.status(400).json({ message: "All fields required" });
    }

    const rideDate = new Date(date);

    if (isNaN(rideDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (rideDate <= new Date()) {
      return res.status(400).json({
        message: "Please select a future date and time.",
      });
    }

    // CREATE RIDE
    const ride = new Ride({
      driver: driverId,
      from,
      to,
      date: rideDate,
      seatsAvailable,
      price,
    });

    await ride.save();

    console.log("Ride saved:", ride);

    // 🔥 SOCKET EMIT (MUST BE INSIDE TRY)
    const io = req.app.get("io");
    if (io) {
      io.emit("rideCreated", ride);
    }

    // ✅ SINGLE RESPONSE
    res.status(201).json({
      message: "Ride created successfully",
      ride,
    });

  } catch (error) {
    console.error("Create ride error:", error);
    res.status(500).json({ message: "Failed to create ride" });
  }
});
// =========================
// GET ALL RIDES
// =========================
router.get("/", async (req, res) => {
  try {
    const rides = await Ride.find().populate("driver", "email");
    res.json(rides);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch rides" });
  }
});
// =========================
// GET DRIVER RIDES
// =========================
router.get("/my-rides", isAuthenticated, async (req, res) => {
  try {
    const driverId = req.user.id;

    const rides = await Ride.find({ driver: driverId });

    res.json(rides);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch rides" });
  }
});

module.exports = router;  