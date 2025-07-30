/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/server/controllers/capsuleC.js
 * License: MIT (see LICENSE)
*/

const crypto = require("crypto");

const { User, Capsule } = require("../models");
const sanitize = require("../utils/sanitize");

exports.create = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized"});
    if (!req.body) {
        return res.status(400).json({ message: "Request body is required" });
    }

    const user = await User.findById(req.user.id).select("verified");
    if (!user?.verified) {
        return res.status(403).json({ message: "You must verify your account before creating a capsule." });
    }

    const { recipient = null, recipientEmail = null, message = null, media = [], unlockDate = null, isEnc = false } = req.body;

    if (!recipient || !recipientEmail || !message || !unlockDate)
        return res.status(400).json({ message: "Missing required fields" });

    if (req.body.media !== undefined && !Array.isArray(media))
        return res.status(400).json({ message: "Media must be an array" });

    const sanitized = {
        recipient: sanitize(recipient, "name"),
        recipientEmail: sanitize(recipientEmail, "email")
    };

    if (sanitized.recipient.length > 64)
        return res.status(400).json({ message: "Recipient name exceeds maximum length of 64 characters" });
    
    const d = new Date(unlockDate);
    if (isNaN(d.getTime()) || d.getTime() < (Date.now() + 50 * 60 * 1000)) // Give them grace time, instead of 1 hour, a 50 min check at backend is good to go, UX is our priority
        return res.status(400).json({ message: "Unlock date must be at least 50 minutes in the future at the time of submission."})

    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(sanitized.recipientEmail))
        return res.status(400).json({ message: "Invalid email format" });
    if (sanitized.recipientEmail.length > 254)
        return res.status(400).json({ message: "Recipient email exceeds maximum length of 254 characters" });

    if (message.length > 5000)
        return res.status(400).json({ message: "Message limit exceeded. Maximum 5000 characters allowed."})

    if (media.length > 10)
        return res.status(400).json({ message: "Media limit exceeded. Maximum 10 files allowed."})

    const isEncrypted = isEnc === "on";


    let iv, ivMedia, encMsg, encMedia = [];
    const alg = "AES-256-CBC";
    if (isEncrypted && process.env.ENCRYPTION_KEY.length === 32) {
        iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(alg, process.env.ENCRYPTION_KEY, iv);
        encMsg = cipher.update(message, "utf8", "hex");
        encMsg += cipher.final("hex");
        if (media) {
            ivMedia = crypto.randomBytes(16);
            for (let i = 0; i < media.length; i++) {
                encMedia[i] = {};
                const cipherM = crypto.createCipheriv("AES-256-CBC", process.env.ENCRYPTION_KEY, ivMedia);
                encMedia[i].filename = cipherM.update(media[i].filename, "utf8", "hex");
                encMedia[i].filename += cipherM.final("hex");
                const cipherM2 = crypto.createCipheriv("AES-256-CBC", process.env.ENCRYPTION_KEY, ivMedia);
                encMedia[i].path = cipherM2.update(media[i].path, "utf8", "hex");
                encMedia[i].path += cipherM2.final("hex");
            }
        }
    } else if (isEncrypted) {
        console.log("[❌ Error] Invalid encryption key length:", process.env.ENCRYPTION_KEY.length);
        return res.status(500).json({ message: "Encryption key must be 32 bytes long" });
    }

    const unlockObj = new Date(unlockDate);
    if (isNaN(unlockObj.getTime())) {
        return res.status(400).json({ message: "Invalid unlock date format"})
    }

    const newCapsule = new Capsule({
        userId: req.user.id,
        recipient: {
            name: sanitized.recipient,
            email: sanitized.recipientEmail
        },
        message: encMsg ?? message,
        media: encMedia.length ? encMedia : media,
        unlockDate: unlockObj,
        isEncrypted,
        encryption: {
            "msg": iv ? iv.toString("hex") : null,
            "media": ivMedia ? ivMedia.toString("hex") : null,
            "algorithm": alg
        },
    });

    const saved = await newCapsule.save();
    console.log("[✅ Capsule Created] ID:", saved._id.toHexString(), "| Unlocks at:", saved.unlockDate.toISOString());
    return res.status(201).json(saved);
};

exports.view = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const capsules = await Capsule
        .find({ 
            userId: req.user.id,
        })
        .sort({ unlockDate: -1}) // Sort by unlock date, most recent first
        .lean(); // Returns plain object, improves performance

    return res.status(200).json(capsules.map(c => ({
        _id: c._id.toHexString(),
        recipient: c.recipient,
        unlockDate: c.unlockDate.toISOString(),
        createdAt: c.createdAt.toISOString(),
        opened: c.opened,
    })));
};