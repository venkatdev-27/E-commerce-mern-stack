import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        server: {
            port: 3002,
            host: '0.0.0.0',
            hmr: false, // Disable Hot Module Replacement to remove WebSocket errors
        },
        plugins: [react()],
        // 🔐 Environment variables
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        },
        // 📁 Path alias
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'), // ✅ better practice
            },
        },
        // 🏗️ Build configuration
        build: {
            outDir: 'build', // ✅ creates build/ instead of dist/
            emptyOutDir: true, // cleans old build
        },
    };
});
