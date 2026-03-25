import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      // Forward all /api requests to the Express server in development.
      // This makes cookies first-party (same origin: localhost:5173),
      // exactly mirroring how a production reverse proxy works.
      "/api": {
        // Proxy to Railway when testing production server locally.
        // Switch to "http://localhost:3000" when running the server locally.
        target: "https://ptm-production-1812.up.railway.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

