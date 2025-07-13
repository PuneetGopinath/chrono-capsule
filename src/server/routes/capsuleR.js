// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/server/routes/capsuleR.js
// License: MIT (see LICENSE)

const express = require("express");
const router = express.Router();

const { create, view } = require("../controllers/capsuleC");
const asyncHandler = require("../utils/asyncHandler");

router.post("/create", asyncHandler(create));
router.post("/view", asyncHandler(view));

module.exports = router;