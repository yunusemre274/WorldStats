import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      // Fallback alias: some builds try to resolve `tw-animate-css` directly
      // Map it to a local stub so Vercel/Vite doesn't fail when the package
      // cannot be resolved in certain build environments.
      "tw-animate-css": path.resolve(import.meta.dirname, "client", "src", "stubs", "tw-animate-css.css"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
  },
});
