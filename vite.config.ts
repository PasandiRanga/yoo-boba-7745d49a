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
      '0854-2402-d000-a400-da2d-7939-f9d5-726c-6d75.ngrok-free.app',
      // Keep any existing allowed hosts
    ],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    sourcemap: false,
    target: 'es2020',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'pg': path.resolve(__dirname, 'src/lib/db'),
    },
  },
  optimizeDeps: {
    exclude: ['pg'], // Prevent Vite from bundling pg incorrectly
  },
  ssr: {
    noExternal: ['pg'], // Ensure pg is processed by Vite for SSR
  },
  esbuild: {
    target: 'es2020',
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  define: {
    global: 'globalThis',
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  // Disable TypeScript checking in development to resolve build conflicts
  ...(mode === 'development' && {
    esbuild: {
      target: 'es2020',
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
      loader: 'tsx',
      include: /\.(ts|tsx)$/,
    },
  }),
}));
