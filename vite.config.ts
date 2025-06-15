import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    allowedHosts: [
      '0854-2402-d000-a400-da2d-7939-f9d5-726c-6d75.ngrok-free.app',
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
