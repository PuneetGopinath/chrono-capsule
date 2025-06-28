import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": "http://localhost:3000", // Proxy API requests to the backend server
        }
    },
    build: {
        outDir: "../server/client-dist",
        emptyOutDir: true,
    }
});