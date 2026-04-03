const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  from: String,
  to: String,
  date: Date,
  seatsAvailable: Number,
  price: Number,
}, { timestamps: true });

module.exports = mongoose.model("Ride", rideSchema);