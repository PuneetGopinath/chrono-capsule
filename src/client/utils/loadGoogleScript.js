/**
 * © 2026 Puneet Gopinath. All rights reserved.
 * Filename: src/client/utils/loadGoogleScript.js
 * License: MIT (see LICENSE)
 */

let googleScriptPromise;

export default function loadGoogleScript() {
    if (window.google?.accounts?.id)
        return Promise.resolve();

    if (googleScriptPromise)
        return googleScriptPromise;

    googleScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;

        script.onload = () => {
            console.log("[INFO] Google OAuth script loaded successfully.");
            resolve();
        };
        script.onerror = (err) => {
            console.error("[ERROR] Failed to load Google OAuth script:", err);
            reject(err);
        };

        document.head.appendChild(script);
    });

    return googleScriptPromise;
};