// © 2025 Puneet Gopinath. All rights reserved.
// Filename: src/server/utils/decrypt.js
// License: MIT

const crypto = require("crypto");

const decrypt = (encryptedHex, ivHex, key, alg) => {
    const decipher = crypto.createDecipheriv(alg, key, Buffer.from(ivHex, "hex"));
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};

const decryptCapsule = (c, key) => {
    const data = c.toObject(); // c is a Mongoose document, convert to plain object
    const decrypted = {
        ...data,
        message: data.isEncrypted && data.encryption?.msg
            ? decrypt(data.message, data.encryption.msg, key, data.encryption.algorithm)
            : data.message,
        media: data.isEncrypted && Array.isArray(data.media) && data.encryption?.media
            ? data.media.map(m => {
                return {
                    filename: decrypt(m.filename, data.encryption.media, key, data.encryption.algorithm),
                    path: decrypt(m.path, data.encryption.media, key, data.encryption.algorithm)
                };
            })
            : data.media
    };

    if (c.isEncrypted && Array.isArray(c.media) && c.encryption?.media) {
        decrypted.media = c.media.map(m => {
            return {
                filename: decrypt(m.filename, c.encryption.media, key, c.encryption.algorithm),
                path: decrypt(m.path, c.encryption.media, key, c.encryption.algorithm)
            };
        });
    }

    return decrypted;
};

module.exports = decryptCapsule;