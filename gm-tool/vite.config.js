import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import postcss from "./postcss.config.js";
import copy from "rollup-plugin-copy";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    server: {
      port: 8080,
      open: false,
      root: "src",
      publicDir: "../public",
      // proxy: {
      //   '/api': {
      //     target: 'http://192.168.0.188:56701',
      //     changeOrigin: true,
      //     ws: true,
      //     rewrite: path => replace(/^\/api/, '')
      // }
      // }
    },
    build: {
      emptyOutDir: true,
      outDir: resolve(__dirname, "public", "dist"),
      // publicPath: "",
      sourcemap: false,
      minify: true,
    },
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
      copy({
        targets: [
          {
            src: resolve(__dirname, "src", "images"),
            dest: resolve(__dirname, "public"),
          },
        ],
        copyOnce: true, // 실행하고 한번만 copy 하게 만들어줌
        hook: "config", // hook으로 config의 실행 시점으로 일치 시켜줌
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
  });
};
