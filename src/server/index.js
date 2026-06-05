/**
 * © 2025 Puneet Gopinath. All rights reserved.
 * Filename: src/server/index.js
 * License: MIT (see LICENSE)
*/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");

const capsule = require("./routes/capsuleR");
const auth = require("./routes/authR");

const Database = require("./utils/db");
const unlockCapsules = require("./utils/scheduler");

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.TRUSTED_PROXIES && process.env.TRUSTED_PROXIES.length > 0) {
    const trustedProxies = process.env.TRUSTED_PROXIES?.split(",").map(p => p.trim());
    app.set("trust proxy", trustedProxies);
    console.log("[✅ Info] Trusted proxies configured:", trustedProxies);
} else {
    app.set("trust proxy", "127.0.0.1"); // Default to localhost if no trusted proxies are set
    console.log("[⚠️ Warning] No trusted proxies configured. Defaulting to localhost");
}

app.use(cors());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "https://accounts.google.com", "https://apis.google.com"],
            "frame-src": ["'self'", "https://accounts.google.com"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
        }
    }
}));
app.use(express.json());
app.use((req, res, next) => {
    try {
        let token = req.get("Authorization");
        if (token) {
            if (token.startsWith("Bearer ")) token = token.slice(7); // Remove "Bearer " prefix
            token = token.trim();
            const data = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
            if (data?.id) {
                req.user = { id: data.id };
            }
        }
    } catch (err) {
        console.log("[❌ Error] JWT verification failed:", err.message);
    } finally {
        next();
    }

});

app.get("/", (req, res) => {
    res.send("Chrono-Capsule is running ⏳");
});

app.get("/health", (req, res) => {
    res.status(200).json({ "status": "OK", "timestamp": new Date().toISOString() });
});

app.use("/api/capsules", capsule);
app.use("/api/auth", auth);

//app.use(express.static(path.join(__dirname, "client-dist")));

//app.get(/.*/, (req, res) => {
//    res.sendFile(path.join(__dirname, "client-dist/index.html"));
//});

app.use((err, req, res, next) => {
    console.log("[❌ Error] Message:", err.message);
    res.status(500).json({ message: err.message || "Server error" });
});

(async () => {
    await Database.connect();
    if (!Database.connected) {
        process.exit(1);
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is live at http://localhost:${PORT}`);
    });
})();

// Schedule the capsule unlocking task every 10 minutes
cron.schedule("*/10 * * * *", unlockCapsules, {
    timezone: process.env.TZ || "Asia/Kolkata"
});