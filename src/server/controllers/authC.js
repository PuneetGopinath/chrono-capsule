/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/server/controllers/authC.js
 * License: MIT (see LICENSE)
*/

const { v4, validate: uuidValidate } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");

const { User } = require("../models");

const sendConfirmation = require("../utils/sendConfirmation");
const { sanitize, usernameRegex } = require("../utils/sanitize");

const client = new OAuth2Client();

const verify = async (id_token) => {
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const userid = payload["sub"];
    console.log(userid);
    return userid;
};

exports.register = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Request body is required" });
    }
    const { username = null, email = null, password = null } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required." });
    }

    if (usernameRegex.test(username)) {
        return res.status(400).json({ message: "Username cannot contain spaces or any special characters other than . _ - @"})
    }

    const sanitized = {
        username: sanitize(username, "username"),
        email: sanitize(email, "email"),
        password: sanitize(password, "password")
    };

    let exists = await User.findOne({ username: sanitized.username });
    if (exists) return res.status(400).json({ message: "Username already exists" });

    exists = await User.findOne({ email: sanitized.email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    if (sanitized.username.length < 3 || sanitized.username.length > 30) {
        return res.status(400).json({ message: "Username must be between 3 and 30 characters" });
    }

    if (sanitized.password.length < 8 || sanitized.password.length > 128) {
        return res.status(400).json({ message: "Password must be between 8 and 128 characters" });
    }

    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(sanitized.email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (sanitized.email.length > 254) {
        return res.status(400).json({ message: "Email is too long" });
    }

    const token = v4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const user = await User.create({
        ...sanitized,
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

    const sanitized = {
        username: sanitize(username, "username"),
        password: sanitize(password, "password")
    };

    const user = await User.findOne({ username: sanitized.username });
    let isMatch = false;
    if (user) {
        isMatch = await bcrypt.compare(sanitized.password, user.password);
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
    let sanitizedEmail;
    if (email) sanitizedEmail = sanitize(email, "email");

    const user = await User.findOne(req.user?.id ? { _id: req.user.id } : { email: sanitizedEmail });

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

exports.status = async (req, res) => {
    if (!req.query?.token) {
        return res.status(400).json({ message: "Token is required" });
    }

    const { token } = req.query;

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
        if (data?.id)
            return res.status(200).json({ message: "Token hasn't expired yet, go ahead and create capsules!", expired: false });
    } catch (err) {
        return res.status(401).json({ message: "Token has EXPIRED, please login again!!", expired: true });
    }

    return res.status(400).json({ message: "Token doesn't contain any id field", expired: true });
};