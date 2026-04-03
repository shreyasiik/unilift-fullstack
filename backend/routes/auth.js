const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
const isAuthenticated = require("../middleware/isAuthenticated");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");

// =========================
// RATE LIMITER
// =========================
const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
});

// =========================
// GENERATE OTP
// =========================
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// =========================
// SEND OTP
// =========================
router.post("/send-otp", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.endsWith("@medicaps.ac.in")) {
      return res.status(400).json({ message: "Invalid college email." });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.EMAIL_FROM,
          name: "UniLift",
        },
        to: [{ email }],
        subject: "UniLift OTP Verification",
        htmlContent: `
          <h2>Your OTP Code</h2>
          <h1>${otp}</h1>
          <p>Valid for 5 minutes.</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Send OTP Error:", error.message);
    res.status(500).json({ message: "Failed to send OTP." });
  }
});

// =========================
// VERIFY OTP
// =========================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email });
    if (!record) {
      return res.status(400).json({ message: "OTP not found." });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired." });
    }

    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // 🔥 delete old OTP
    await Otp.deleteOne({ email });

    // 🔥 create VERIFIED flag
    await Otp.create({
      email,
      otp: "VERIFIED",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // ✅ ONLY ONE RESPONSE
    res.json({ message: "OTP verified. You can now register." });

  } catch (error) {
    res.status(500).json({ message: "Verification failed." });
  }
});


router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      drivingLicense,
      vehicleNumber,
      vehicleType,
    } = req.body;

    // 🔥 CHECK OTP VERIFIED
    const verified = await Otp.findOne({ email, otp: "VERIFIED" });

    if (!verified) {
      return res.status(403).json({
        message: "Email not verified via OTP.",
      });
    }

    // 🔥 CHECK EXISTING USER
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    // 🔥 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 CREATE USER
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      licenseNumber: role === "driver" ? drivingLicense : undefined,
      vehicleNumber: role === "driver" ? vehicleNumber : undefined,
      vehicleType: role === "driver" ? vehicleType : undefined,
      isApproved: role === "driver" ? false : true,
      isAdmin: false,
    });

    await newUser.save();

    // 🔥 DELETE OTP AFTER SUCCESS
    await Otp.deleteMany({ email });

    res.status(201).json({
      message: "User registered successfully.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Registration failed.",
    });
  }
});

// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // 🔥 check password exists
    if (!user.password) {
      return res.status(400).json({ message: "User has no password set." });
    }

    // 🔥 compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    // ban checking
if (user.isBanned) {
  return res.status(403).json({
    message: "Your account has been banned.",
  });
}

    // 🔥 create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        isAdmin: user.isAdmin || false,
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin || false,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error); // 🔥 IMPORTANT
    res.status(500).json({ message: "Login failed." });
  }
});
// =========================
// 🔥 GET CURRENT USER
// =========================
router.get("/me", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});


// =========================
// EXPORT
// =========================
module.exports = router;
