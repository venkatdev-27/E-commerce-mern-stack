import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = mode === "production";

  return {
    plugins: [react()],

    // ✅ Dev only
    server: !isProduction 
      ? {
          host: "0.0.0.0",
          port: 5173,
          hmr: true,
        }
      : undefined,

    // ❌ No preview needed with Nginx

    // ⚠️ Only expose PUBLIC env variables
    define: {
      "process.env": {},
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    build: {
      outDir: "dist",      // MUST match Dockerfile
      emptyOutDir: true,
    },
  };
});
