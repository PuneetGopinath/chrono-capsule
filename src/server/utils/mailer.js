// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/server/utils/mailer.js
// License: MIT

const nodemailer = require("nodemailer");

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
    // Upgrade to use EJS templates later
    const html = (name, msg) => (`<!DOCTYPE html>
<html>
    <body style="font-family:Arial, sans-serif; line-height:1.6; color:#333;">
        <div style="max-width:600px; margin:auto; padding:20px; border:1px solid #ccc; box-sizing: border-box">
            <h2 style="color: #4a90e2;">📬 <span style="display:none;">New Capsule:</span> A Chrono Capsule Has Arrived!</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>🚀 The future has arrived...! A capsule addressed to you has just been unlocked—feel free to explore the message and any attached media.</p>
            <blockquote style="font-size: 1.1em; color: #444; background: #f9f9f9; padding: 10px 15px; border-left: 4px solid #4a90e2;">
                ${msg}
            </blockquote>
            <p style="font-size:0.9em; color:#666;">Thank you for using Chrono Capsule. Keep traveling through time responsibly ⏳</p>
            <a href="" style="display:inline-block; padding:10px 15px;">Visit Chrono Capsule</a>
        </div>
    </body>
</html>`);

    const text = (name, msg) => (`📬 A Chrono Capsule Has Arrived!
Hello ${name},\n
🚀 The future has arrived...! A capsule addressed to you has just been unlocked—feel free to explore the message and any attached media.

>> ${msg}\n
Thank you for using Chrono Capsule. Keep traveling through time responsibly ⏳`);

    try {
        const sent = [];
        for (const _c of capsules) {
            let c;
            if (_c.isEncrypted) {
                c = decrypt(_c, process.env.ENCRYPTION_KEY);
            } else 
                c = _c;
            const info = await transporter.sendMail({
                from: `"Chrono Capsule" <${process.env.SMTP_USER}>`, // sender address
                to: c.recipient.email, // list of receivers
                subject: "Your Chrono Capsule is Unlocked!", // Subject line
                text: text(c.recipient.name, c.message),
                html: html(c.recipient.name, c.message),
                attachments: c.media ? c.media : []
            });
            //TODO: Optimize for scalability
            //TODO: Store delivery receipts? (Maybe - Is it required?)
            //TODO: Decrypt media files before sending VERY VERY IMPORTANT
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