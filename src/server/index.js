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
        const token = req.get("Authorization");
        if (token) {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            if (data?.id) {
                req.user = { id: data.id };
            }
        }
    } catch (err) {
        console.error("❌ JWT verification failed:", err.message);
    } finally {
        next();
    }

});

app.get("/", (req, res) => {
    res.send('Chrono-Capsule is running ⏳');
});

app.get("/api/capsules", capsule);
app.get("/api/auth", auth);

app.use((err, req, res, next) => {
    console.error('❌ Error caught:', err.message);
    res.status(500).json({ error: err.message || 'Server error' });
});

(async () => {
    await Database.connect();

    app.listen(PORT, () => {
      console.log(`🚀 Server is live at http://localhost:${PORT}`);
    });
})();