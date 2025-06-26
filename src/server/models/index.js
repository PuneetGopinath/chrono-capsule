const m = require("fs")
    .readdirSync(__dirname)
    .filter((file) => file !== "index.js" && file.endsWith(".js"))

const files = m.map((file) => require(`${__dirname}/${file}`));

const models = {};
for (let i = 0; i < m.length; i++) {
    models[m[i].replace(".js", "")] = files[i];
}
module.exports = models;