import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      includeAssets: [
        "favicon.png",
        "favicon.svg",
        "app-icon-1024.png",
        "pwa/icon-192.png",
        "pwa/icon-512.png",
        "pwa/maskable-icon-192.png",
        "pwa/maskable-icon-512.png",
        "pwa/apple-touch-icon.png",
      ],
      manifest: {
        name: "Aruka",
        short_name: "Aruka",
        description: "Gestão inteligente para profissionais de consultoria fitness e alunos.",
        lang: "pt-BR",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "any",
        theme_color: "#111827",
        background_color: "#f8fafc",
        categories: ["health", "fitness", "productivity"],
        icons: [
          {
            src: "/pwa/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa/maskable-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/pwa/maskable-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        runtimeCaching: [],
      },
    }),
  ],
});
