const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const adminMiddleware = require("../middleware/admin");
const User = require("../models/User");
const Ride = require("../models/Ride");
const Booking = require("../models/Booking");


// =========================
// GET ALL USERS
// =========================
router.get("/users", isAuthenticated, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});


// =========================
// GET ALL RIDES
// =========================
router.get("/rides", isAuthenticated,adminMiddleware, async (req, res) => {
  try {
    const rides = await Ride.find().populate("driver", "email");
    res.json(rides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch rides" });
  }
});


// =========================
// GET ALL BOOKINGS
// =========================
router.get("/bookings",isAuthenticated, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("ride")
      .populate("driver", "email")
      .populate("rider", "email");

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});
// =========================
// DELETE RIDE
// =========================
router.delete("/delete-ride/:id", isAuthenticated, adminMiddleware, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    await Ride.findByIdAndDelete(req.params.id);

    // OPTIONAL: also delete related bookings
    await Booking.deleteMany({ ride: req.params.id });

    res.json({ message: "Ride deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete ride" });
  }
});
// =========================
// BULK DELETE RIDES
// =========================
router.delete("/delete-rides", isAuthenticated, adminMiddleware, async (req, res) => {
  try {
    const { rideIds } = req.body;

    if (!rideIds || rideIds.length === 0) {
      return res.status(400).json({ message: "No rides selected" });
    }

    // delete rides
    await Ride.deleteMany({ _id: { $in: rideIds } });

    // delete related bookings
    await Booking.deleteMany({ ride: { $in: rideIds } });

    res.json({ message: "Rides deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bulk delete failed" });
  }
});

// =========================
// BAN USER
// =========================
router.patch("/ban-user/:id", isAuthenticated,adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = true;
    await user.save();

    res.json({ message: "User banned successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to ban user" });
  }
});


// =========================
// UNBAN USER
// =========================
router.patch("/unban-user/:id", isAuthenticated,adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = false;
    await user.save();

    res.json({ message: "User unbanned successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to unban user" });
  }
});

module.exports = router;