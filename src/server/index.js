require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const capsule = require("./routes/capsuleR");
const auth = require("./routes/authR");

const Database = require("./utils/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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
        console.log("❌ JWT verification failed:", err.message);
    } finally {
        next();
    }

});

app.get("/", (req, res) => {
    res.send("Chrono-Capsule is running ⏳");
});

app.use("/api/capsules", capsule);
app.use("/api/auth", auth);

app.use((err, req, res, next) => {
    console.log("❌ Error caught:", err.message);
    res.status(500).json({ error: err.message || "Server error" });
});

(async () => {
    await Database.connect();
    if (!Database.connected) {
        console.error("❌ Failed to connect to the database. Exiting...");
        process.exit(1);
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is live at http://localhost:${PORT}`);
    });
})();