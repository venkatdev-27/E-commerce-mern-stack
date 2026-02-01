import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    /* =========================
       DEV SERVER (LOCAL ONLY)
    ========================= */
    server: {
      port: 3002,
      host: "0.0.0.0",
      hmr: false,
    },

    /* =========================
       PREVIEW SERVER (RENDER)
    ========================= */
    preview: {
      host: true,
      port: 4173,
      allowedHosts: "all", // ✅ FIXES 403 ON RENDER
    },

    /* =========================
       ENV DEFINITIONS
    ========================= */
    define: {
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },

    /* =========================
       PATH ALIAS
    ========================= */
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    /* =========================
       BUILD CONFIG
    ========================= */
    build: {
      outDir: "build",
      emptyOutDir: true,
    },
  };
});
