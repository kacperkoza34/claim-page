import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export const CERT_FILE_PATH = "certs/cert.pem";
export const KEY_FILE_PATH = "certs/key.pem";

export const viteConfig = {
  server: {
    https: true,
  },
  plugins: [react(), nodePolyfills()],
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
};
