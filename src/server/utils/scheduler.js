// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/server/utils/scheduler.js
// License: MIT (see LICENSE)

const { Capsule } = require("../models");
const mailer = require("./mailer");

const unlockCapsules = async () => {
    if (process.env.DEBUG) console.log("🔓 Checking for capsules to be unlocked...");
    try {
        const now = new Date();
        const unlocked = await Capsule.find({
            unlockDate: { $lte: now },
            opened: false,
        });
        if (unlocked.length > 0) {
            console.log(`Unlocking ${unlocked.length} capsules...`);
            if (process.env.DEBUG) console.log("Recipients:", unlocked.map(c => `${c.recipient.name}=>${c.recipient.email}`).join(", "));
            const success = await mailer(unlocked);
            if (success) {
                await Capsule.updateMany(
                    { _id: { $in: unlocked.map(c => c._id) } },
                    { $set: { opened: true } }
                );
                console.log("[✅ Success] Emails sent for unlocked capsules | Current time:", now.toISOString());
            } else {
                console.log("[❌ Error] Failed to send emails for unlocked capsules.");
            }
        } else if (process.env.DEBUG) console.log("🔓 No capsules to be unlocked at this time.");
    } catch (err) {
        console.log("Error unlocking capsules:", err);
    }
};

module.exports = unlockCapsules;