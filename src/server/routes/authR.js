// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/server/routes/authR.js
// License: MIT (see LICENSE)

const express = require("express");
const router = express.Router();

const { register, login, verify } = require("../controllers/authC");
const asyncHandler = require("../utils/asyncHandler");

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/verify/:token", asyncHandler(verify));

module.exports = router;