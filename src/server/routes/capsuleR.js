const express = require("express");
const router = express.Router();

const { Capsule } = require("../models");

const asyncHandler = require('../utils/asyncHandler');

router.post("/create", asyncHandler(async (req, res) => {
    const { sender, recipient, message, media, unlockDate, isEncrypted, encryptionKey } = req.body;

    const newCapsule = new Capsule({
        sender,
        recipient,
        message,
        media,
        unlockDate,
        isEncrypted,
        encryptionKey
    });

    const saved = await newCapsule.save();
    return res.status(201).json(saved);
}));

router.post("/retrieve", asyncHandler(async (req, res) => {
    const { id } = req.body;
    const capsules = await Capsule.query({ id: id}).exec();
    if (capsules.length === 0) {
        return res.status(404).json({ error: "Capsule not found" });
    }

    return res.status(200).json(capsules[0]);//Capsude.find returns an array of all documents with id as id
}));

module.exports = router;