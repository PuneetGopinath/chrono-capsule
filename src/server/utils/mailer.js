// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/server/utils/mailer.js
// License: MIT (see LICENSE)

const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const decrypt = require("./decrypt");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || ""
    }
});

const mailer = async (capsules) => {
    const htmlPath = path.join(__dirname, "../templates", "capsule.ejs");
    const textPath = path.join(__dirname, "../templates", "capsule.txt.ejs");

    try {
        const sent = [];
        for (const _c of capsules) {
            let c;
            if (_c.isEncrypted) {
                c = decrypt(_c, process.env.ENCRYPTION_KEY);
            } else 
                c = _c;
            const text = await ejs.renderFile(textPath, { name: c.recipient.name, msg: c.message });
            const html = await ejs.renderFile(htmlPath, { name: c.recipient.name, msg: c.message });
            const info = await transporter.sendMail({
                from: `"Chrono Capsule" <${process.env.SMTP_USER}>`, // sender address
                to: c.recipient.email, // list of receivers
                subject: "Your Chrono Capsule is Unlocked!", // Subject line
                text,
                html,
                attachments: c.media ? c.media : []
            });
            sent.push(info);
        }
        if (process.env.DEBUG) console.log("No. of emails sent:", sent.length);
        return sent;
    } catch (err) {
        console.log("❌ Error sending emails:", err.message);
        return false;
    }
};

module.exports = mailer;