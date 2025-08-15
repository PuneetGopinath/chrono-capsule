/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/server/routes/authR.js
 * License: MIT (see LICENSE)
*/

const express = require("express");
const router = express.Router();

const rateLimit = require("express-rate-limit");

const { status, register, login, verify, resendVerification } = require("../controllers/authC");
const asyncHandler = require("../utils/asyncHandler");

const resendLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 requests per window
    message: "Too many resend attempts, please try again later.",
});

router.get("/status", asyncHandler(status));
router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/verify/:token", asyncHandler(verify));
router.post("/resend", resendLimiter, asyncHandler(resendVerification));

module.exports = router;