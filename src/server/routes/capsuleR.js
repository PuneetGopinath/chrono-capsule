const express = require("express");
const router = express.Router();

const { create, unlock } = require("../controllers/capsuleC");
const asyncHandler = require("../utils/asyncHandler");

router.post("/create", asyncHandler(create));
router.post("/unlock", asyncHandler(unlock));

module.exports = router;