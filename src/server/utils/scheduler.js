const { Capsule } = require("../models");
const mailer = require("./mailer");

const unlockCapsules = async () => {
    try {
        const now = new Date();
        const unlocked = await Capsule.find({
            unlockDate: { $lte: now },
            opened: false,
        });
        if (unlocked.length > 0) {
            console.log(`Unlocking ${unlocked.length} capsules...`);
            if (process.env.DEBUG) console.log("Recipients:", unlocked.map(c => `${c.recipient.name},${c.recipient.email}`).join(", "));
            await Capsule.updateMany(
                { _id: { $in: unlocked.map(c => c._id) } },
                { $set: { opened: true } }
            );
            await mailer(unlocked);
            console.log("Capsules unlocked and emails sent.");
        }
    } catch (err) {
        console.log("Error unlocking capsules:", err);
    }
};

module.exports = unlockCapsules;