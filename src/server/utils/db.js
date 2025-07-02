// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/server/utils/db.js
// License: MIT (see LICENSE)

module.exports = class Database {
    constructor() {
        this.models = require("../models");
        this.connected = false;
    }

    static async connect() {
        await require("mongoose")
            .connect(process.env.MONGO_URI)
            .then(() => {
                console.log("Database connected successfully");
                this.connected = true;
            })
            .catch((err) => {
                console.log("Database connection error:", err.message);
            });
        return this.connected;
    }
}