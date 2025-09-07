import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

export default defineConfig({
    root: "./src/client",
    plugins: [react()],
    server: {
        proxy: {
            "/api": `http://localhost:${PORT}`, // Proxy API requests to the backend server
        }
    },
    build: {
        outDir: "../server/client-dist",
        emptyOutDir: true,
    }
});