import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(), // ✅ no manual JSX config needed
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // ✅ optional safety (helps CI resolve jsx-runtime)
      "react/jsx-runtime": "react/jsx-runtime",
    },
  },
});
