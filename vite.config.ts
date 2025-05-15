import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      'b6c6-2402-d000-a400-92d5-d4d4-c25b-78a2-8b4d.ngrok-free.app',
      // Keep any existing allowed hosts
    ],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'pg': path.resolve(__dirname, 'src/lib/db'),
    },
  },
  optimizeDeps: {
    exclude: ['pg'], // Prevent Vite from bundling pg incorrectly
    // include: ['pg/pg-browser.js'],
  },
  ssr: {
    noExternal: ['pg'], // Ensure pg is processed by Vite for SSR
  },
}));
