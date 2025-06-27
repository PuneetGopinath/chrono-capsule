const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "Username already exists" });

    const user = await User.create({ username, email, password });
    if (process.env.DEBUG) console.log("User registered:", user.username);
    return res.status(201).json({
        message: "User registered successfully",
        id: user._id,
    });
};

exports.login = async (req, res) => {
    if (req.user) return res.status(400).json({ message: "Already logged in" });
    const { username, password } = req.body;
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