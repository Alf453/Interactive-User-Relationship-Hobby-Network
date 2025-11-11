import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic", // ✅ force react 17+/18+ jsx transform
      babel: {
        plugins: [
          ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }], // ✅ fallback for CI
        ],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      react: "react",
      "react/jsx-runtime": "react/jsx-runtime", // ✅ ensures rollup can resolve it on Linux
    },
  },
  build: {
    rollupOptions: {
      external: [], // ✅ prevent rollup from "externalizing" react/jsx-runtime
    },
  },
});
