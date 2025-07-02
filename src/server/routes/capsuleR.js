// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/server/routes/capsuleR.js
// License: MIT

const express = require("express");
const router = express.Router();

const { create, unlock } = require("../controllers/capsuleC");
const asyncHandler = require("../utils/asyncHandler");

router.post("/create", asyncHandler(create));
router.post("/unlock", asyncHandler(unlock));

module.exports = router;