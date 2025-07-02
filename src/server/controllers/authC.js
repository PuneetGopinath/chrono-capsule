// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/server/controllers/authC.js
// License: MIT

const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Request body is required" });
    }
    const { username = null, email = null, password = null } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required." });
    }

    let exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "Username already exists" });

    exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ message: "Username must be between 3 and 30 characters" });
    }

    if (password.length < 8 || password.length > 128) {
        return res.status(400).json({ message: "Password must be between 8 and 128 characters" });
    }

    const cleanEmail = email.trim().toLowerCase(); // Most email providers are case-insensitive

    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(cleanEmail)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (cleanEmail.length > 254) {
        return res.status(400).json({ message: "Email is too long" });
    }

    const user = await User.create({ username, email: cleanEmail , password });
    if (process.env.DEBUG) console.log("User registered:", user.username);
    return res.status(201).json({
        message: "User registered successfully",
        id: user._id,
    });
};

exports.login = async (req, res) => {
    if (req.user) return res.status(400).json({ message: "Already logged in" });
    if (!req.body) {
        return res.status(400).json({ message: "Request body is required" });
    }
    const { username = null, password = null } = req.body;
    const user = await User.findOne({ username });
    let isMatch;
    if (user) {
        isMatch = await bcrypt.compare(password, user.password);
    }
    if (!user || !isMatch) return res.status(401).json({ message: "Invalid credentials"});

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "7d" });
    if (process.env.DEBUG) console.log("User logged in:", user.username, "\nJWT Token:", token);
    return res.status(200).json({ message: "Login successful", token});
};