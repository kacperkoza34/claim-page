import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import mkcert from "vite-plugin-mkcert";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  server: { https: true },
  plugins: [react(), nodePolyfills(), mkcert()],
  resolve: {
    alias: {
      buffer: "buffer",
      "@src": "/src",
    },
  },
  define: {
    "process.env": {},
    global: "window",
  },
  base: "./",
  build: {
    rollupOptions: {
      plugins: [
        commonjs({
          filter(id) {
            if (id.includes("node_modules/hashconnect")) {
              return true;
            }
          },
        }),
      ],
    },
  },
});
