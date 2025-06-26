const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "Username already exists" });

    const user = await User.create({ username, email, password });
    return res.status(201).json({
        message: "User registered successfully",
        id: user._id,
    });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
    }
    if (!user || !isMatch) return res.status(401).json({ message: "Invalid credentials"});

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({ message: "Login successful", token});
};