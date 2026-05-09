import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    env: {
      MONGODB_URI: "mongodb://ghost-database",
    },
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
