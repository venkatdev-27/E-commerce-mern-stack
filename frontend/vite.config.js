import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    server: {
      host: "0.0.0.0",
      port: 4173,
      hmr: false,  
    },

    // 🔥 THIS IS THE IMPORTANT PART
    preview: {
      host: "0.0.0.0",
      port: 4173,
      allowedHosts: [
        "luxemarket-ljoh.onrender.com"
      ],
    },

    define: {
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    build: {
      outDir: "build",
      emptyOutDir: true,
    },
  };
});
