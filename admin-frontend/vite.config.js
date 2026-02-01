import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    server: {
      host: "0.0.0.0",
      port: 5173,
      hmr: false,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // 🔥 REQUIRED FOR RENDER
    preview: {
      host: "0.0.0.0",
      port: 5173,
      allowedHosts: [
        "luxemarket-admin.onrender.com" 
      ],
    },

    define: {
      "process.env": env,
    },

    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: true,
    },
  };
});
