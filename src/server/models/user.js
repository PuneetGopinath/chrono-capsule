// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/server/models/user.js
// License: MIT (see LICENSE)

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        maxLength: 254, // Standard max length for email addresses as per RFC 5321
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verification: {
        token: {
            type: String,
            index: true
        },
        expiresAt: {
            type: Date
        }
    },
});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;