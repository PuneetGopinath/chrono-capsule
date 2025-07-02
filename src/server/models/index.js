// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/server/models/index.js
// License: MIT

const m = require("fs")
    .readdirSync(__dirname)
    .filter((file) => file !== "index.js" && file.endsWith(".js"))

const files = m.map((file) => require(`${__dirname}/${file}`));

const models = {};
for (let i = 0; i < m.length; i++) {
    let name = m[i].replace(".js", "");
    name = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize the first letter
    models[name] = files[i];
}
module.exports = models;