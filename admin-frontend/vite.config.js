import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = mode === "production";

  return {
    plugins: [react()],

    // ✅ Dev server only (local)
    server: !isProduction
      ? {
          host: "0.0.0.0",
          port: 5173,
          hmr: true,
        }
      : undefined,

    // ❌ No preview needed (Nginx handles production)

    // ✅ Only expose VITE_ variables automatically
    // (Vite already does this, so no manual define needed)

    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: false,
    },
  };
});
