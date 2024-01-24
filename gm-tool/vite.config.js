import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import postcss from "./postcss.config.js";
import copy from "rollup-plugin-copy";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [
      react({
        // Use React plugin in all *.jsx and *.tsx files
        include: "**/*.{jsx,tsx}",
        babel: {
          plugins: [
            [
              "babel-plugin-styled-components",
              {
                ssr: true,
                displayName: true,
                preprocess: false,
              },
            ],
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    css: {
      postcss,
      devSourcemap: true,
    },
    optimizeDeps: {
      auto: true,
    },
    build: {
      chunkSizeWarningLimit: 100,
      minify: true,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
            return;
          }
          warn(warning);
        },
      },
    },
  });
};
