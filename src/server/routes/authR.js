const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authC");
const asyncHandler = require("../utils/asyncHandler");

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

module.exports = router;