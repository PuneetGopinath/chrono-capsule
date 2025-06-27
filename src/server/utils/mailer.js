const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const mailer = async (capsules) => {
    try {
        const sent = [];
        for (const c of capsules) {
            const info = await transporter.sendMail({
                from: `"Chrono Capsule" <${process.env.SMTP_USER}>`, // sender address
                to: c.recipient.email, // list of receivers
                subject: "Your Chrono Capsule is Unlocked!", // Subject line
                text: `Hello ${c.recipient.name},\n\nYour capsule with the message "${c.message}" has been unlocked! You can now view it.\n\nBest regards,\nChrono Capsule Team`,
                html: `<p>Hello${c.recipient.name},</p><p>Your capsule with the message "<strong>${c.message}</strong>" has been unlocked! You can now view it.</p><p>Best regards,<br>Chrono Capsule Team</p>`,
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
    }
};

module.exports = mailer;