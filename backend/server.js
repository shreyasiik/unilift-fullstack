require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors({
  origin: "https://unilift.vercel.app", // ✅ your frontend URL
  credentials: true,
}));
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/auth");
const rideRoutes = require("./routes/ride");
const bookingRoutes = require("./routes/booking");
const adminRoutes = require("./routes/admin");

const app = express();

// =============================
// CREATE HTTP SERVER + SOCKET
// =============================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://unilift-frontend.vercel.app",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);

// =============================
// SOCKET CONNECTION
// =============================
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// =============================
// MIDDLEWARE
// =============================
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://unilift-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// =============================
// SESSION
// =============================
app.set("trust proxy", 1);




// =============================
// ROUTES
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("UniLift Backend Running 🚀");
});

// =============================
// DATABASE + SERVER START
// =============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB ERROR:", err);
  });