const express = require("express");
const router = express.Router();

const { create, retrieve } = require("../controllers/capsuleC");
const asyncHandler = require("../utils/asyncHandler");

router.post("/create", asyncHandler(create));
router.post("/retrieve", asyncHandler(retrieve));

module.exports = router;