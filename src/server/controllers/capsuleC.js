const crypto = require("crypto");
const { Capsule } = require("../models");

exports.create = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized"});
    const { recipient, message, media, unlockDate, isEncrypted } = req.body;

    if (!recipient || !message || !unlockDate) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    let iv, ivMedia, encMsg, encMedia;
    const alg = "AES-256-CBC";
    if (isEncrypted) {
        if (process.env.ENCRYPTION_KEY.length !== 32) {
            console.log("❌ Invalid encryption key length:", process.env.ENCRYPTION_KEY.length);
            return res.status(500).json({ error: "Encryption key must be 32 bytes long" });
        }
        iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(alg, process.env.ENCRYPTION_KEY, iv);
        encMsg = cipher.update(message, "utf8", "hex");
        encMsg += cipher.final("hex");
        if (media) {
            ivMedia = crypto.randomBytes(16);
            const cipherMedia = crypto.createCipheriv("AES-256-CBC", process.env.ENCRYPTION_KEY, ivMedia);
            encMedia = cipherMedia.update(media, "utf8", "hex");
            encMedia += cipherMedia.final("hex");
        }
    }

    const unlockObj = new Date(unlockDate);
    if (isNaN(unlockObj.getTime())) {
        return res.status(400).json({ error: "Invalid unlock date format"})
    }

    const newCapsule = new Capsule({
        userId: req.user.id,
        recipient,
        message: encMsg ?? message,
        media: encMedia ?? media,
        unlockDate: unlockObj,
        isEncrypted,
        encryption: {
            "msg": iv ? iv.toString("hex") : null,
            "media": ivMedia ? ivMedia.toString("hex") : null,
            "algorithm": alg
        },
    });

    const saved = await newCapsule.save();
    return res.status(201).json(saved);
};

exports.unlock = async (req, res) => {
    const capsules = await Capsule.find({ 
        userId: req.user.id, 
        unlockDate: { $lte: new Date() }
    }).sort({ unlockDate: -1});

    return res.status(200).json(capsules);
};