const mongoose = require("mongoose");

const capsuleSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: false
    },
    unlockDate: {
        type: Date,
        required: true
    },
    isEncrypted: {
        type: Boolean,
        default: false
    },
    encryption: {
        type: Object,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    opened: {
        type: Boolean,
        default: false
    }
});

const Capsule = mongoose.model("Capsule", capsuleSchema);
module.exports = Capsule;