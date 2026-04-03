const User = require("../models/User");

module.exports = async function adminMiddleware(req, res, next) {
  try {
    // 🔥 use JWT user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);

    if (!user || user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.admin = user;
    next();

  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Admin middleware error" });
  }
};