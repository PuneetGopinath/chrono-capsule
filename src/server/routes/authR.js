// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/server/routes/authR.js
// License: MIT (see LICENSE)

const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authC");
const asyncHandler = require("../utils/asyncHandler");

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

module.exports = router;