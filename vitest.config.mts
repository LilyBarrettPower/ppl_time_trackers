import { defineConfig } from "vitest/config";

// Vitest runs our unit tests (mainly the billing/GST maths in src/lib/domain).
export default defineConfig({
  resolve: {
    // Lets tests understand the "@/..." import alias defined in tsconfig.json.
    tsconfigPaths: true,
  },
  test: {
    // Business logic is plain TypeScript, so a Node environment is enough —
    // no simulated browser needed.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
