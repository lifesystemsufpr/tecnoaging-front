import { defineConfig } from "vitest/config";
import path from "path";

// Config de teste isolada (não altera o next.config nem o build do app).
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/utils/**/*.ts"],
      exclude: ["src/**/*.{test,spec}.ts"],
    },
  },
});
