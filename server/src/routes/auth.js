const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD;
  const secret = process.env.JWT_SECRET;

  if (!adminEmail || !passwordHash || !secret) {
    return res.status(500).json({ error: "Admin login is not configured" });
  }

  const passwordMatches = await bcrypt.compare(password, passwordHash);

  if (email !== adminEmail || !passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ email: adminEmail }, secret, { expiresIn: "8h" });
  res.status(200).json({ token });
});

router.get("/me", requireAdmin, (req, res) => {
  res.status(200).json({ email: req.admin.email });
});

module.exports = router;