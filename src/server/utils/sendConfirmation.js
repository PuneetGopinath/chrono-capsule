// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/server/utils/sendConfirmation.js
// License: MIT (see LICENSE)

const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || ""
    }
});

const website = process.env.WEBSITE_URL || "https://capsule.puneetg.me";

const htmlPath = path.join(__dirname, "../templates", "confirm.ejs");
const textPath = path.join(__dirname, "../templates", "confirm.txt.ejs");

const sendConfirmation = async (name, email, token) => {
    if (process.env.DEBUG) console.log("[🔔] Sending confirmation email for", name);
    const verifyLink = `${website}/verify/${token}`;
    try {
        const html = await ejs.renderFile(htmlPath, { name, verifyLink, website });
        const text = await ejs.renderFile(textPath, { name, verifyLink, website });

        const info = await transporter.sendMail({
            from: `"Chrono Capsule" <${process.env.SMTP_SENDER || process.env.SMTP_USER}>`,
            to: email,
            subject: `Confirm your Chrono Capsule account, ${name}!`,
            text,
            html
        });
        if (process.env.DEBUG) console.log("[✅] Confirmation email sent for", name);

        return info;
    } catch (err) {
        console.log("[❌ Error] Confirmation email:", err.message);
        return false;
    }
};

module.exports = sendConfirmation;