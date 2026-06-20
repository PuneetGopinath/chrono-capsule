import path from "path";

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        root: "./src/client",
        envDir: path.resolve(__dirname),
        plugins: [react()],
        server: {
            proxy: {
                "/api": `http://localhost:${env.PORT || 3000}`, // Proxy API requests to the backend server
            }
        },
        build: {
            outDir: "../server/client-dist",
            emptyOutDir: true,
        }
    };
});