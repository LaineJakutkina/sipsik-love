import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite-plus";

export default defineConfig({
  // relative asset URLs: works on GitHub Pages under /sipsik-love/ and on any other path (hash router)
  base: "./",
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    target: "es2022",
    // the isolated pixi.js chunk is ~550 kB by design
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        // pixi.js is heavy and changes rarely: keep it in its own long-cached chunk
        advancedChunks: {
          groups: [{ name: "pixi", test: /node_modules[\\/]pixi\.js/ }],
        },
      },
    },
  },
  fmt: {
    ignorePatterns: ["public/**"],
  },
  lint: {
    ignorePatterns: ["dist/**", "public/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    plugins: ["typescript", "vue", "unicorn", "import"],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "no-unused-vars": "error",
    },
  },
});
