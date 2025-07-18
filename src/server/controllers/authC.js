/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/server/controllers/authC.js
 * License: MIT (see LICENSE)
*/

const { v4, validate: uuidValidate } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
const sendConfirmation = require("../utils/sendConfirmation");

const trimEmail = email => email.trim().toLowerCase();

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

    const cleanEmail = trimEmail(email); // Most email providers are case-insensitive

    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(cleanEmail)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (cleanEmail.length > 254) {
        return res.status(400).json({ message: "Email is too long" });
    }

    const token = v4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const user = await User.create({
        username,
        email: cleanEmail,
        password,
        verification: {
            token,
            expiresAt
        }
    }); // Password will be hashed automatically by the pre-save hook

    await sendConfirmation(user.username, user.email, token);

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

exports.verify = async (req, res) => {
    const obj = { verified: false };
    if (!req.params || !req.params.token) {
        return res.status(400).json({ ...obj, message: "Verification token is required" });
    }
    const { token } = req.params;

    if (!uuidValidate(token)) {
        return res.status(400).json({ ...obj, message: "Invalid token format" });
    }

    const user = await User.findOne({ "verification.token": token });

    if (!user) {
        return res.status(404).json({ ...obj, message: "Invalid token. Make sure you're using the latest link provided." });
    }

    if (user.verified) {
        return res.status(400).json({ message: "User already verified", verified: true });
    }

    if (user.verification.expiresAt < (new Date())) {
        return res.status(400).json({ ...obj, message: "Token has expired" });
    }

    user.verification.token = null;
    user.verification.expiresAt = null;
    user.verified = true;

    await user.save();

    if (process.env.DEBUG) console.log(`[VERIFY] User ${user.email} verified at ${new Date().toISOString()}`);
    return res.status(200).json({ message: "User verified successfully", id: user._id, verified: true });
};

exports.resendVerification = async (req, res) => {
    if ((!req.body?.email) && (!req.user?.id)) {
        return res.status(400).json({ message: "Request body is required" });
    }

    const { email = null } = req.body;

    const user = await User.findOne(req.user?.id ? { _id: req.user.id } : { email: trimEmail(email) });

    if (!user) {
        return res.status(200).json({ message: "If the user exists, a verification link will be sent." });
    }

    if (user.verified) {
        return res.status(400).json({ message: "User already verified", verified: true });
    }

    const token = v4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verification.token = token;
    user.verification.expiresAt = expiresAt;
    await user.save();

    await sendConfirmation(user.username, user.email, token);
    return res.status(200).json({ message: "If the user exists, a verification link will be sent." });
};