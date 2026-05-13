import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

const ANALYZE = process.env.ANALYZE === "true";

export default defineConfig({
  plugins: [
    react(),
    ...(ANALYZE
      ? [visualizer({ open: true, filename: "dist/stats.html", gzipSize: true, brotliSize: true })]
      : []),
  ],
  build: {
    target: "esnext",
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (id.includes("react-dom") || id.includes("react/")) {
            return "react-vendor";
          }

          if (id.includes("gsap")) {
            return "gsap-vendor";
          }

          if (
            id.includes("@react-three") ||
            id.includes("three") ||
            id.includes("meshopt") ||
            id.includes("draco")
          ) {
            return "three-vendor";
          }

          if (id.includes("@splinetool")) {
            return "spline-vendor";
          }

          if (id.includes("@supabase")) {
            return "supabase-vendor";
          }

          return undefined;
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
