import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Vitest runs the source-tracking module's tests (modules/, config/) and the
 * visitor-cookie tests. Pure logic only (node environment, no DOM, no Next
 * runtime); `npm run build` stays the site's main correctness gate.
 *
 * The older tests in lib's __tests__ folders use node:test, not Vitest, so they
 * are deliberately NOT included here (run them with `node --test`).
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: [
      // @module source-tracking:begin vitest-include
      "modules/**/*.test.ts",
      "config/**/*.test.ts",
      // @module source-tracking:end vitest-include
      "proxy.test.ts", "lib/visitor.test.ts"],
  },
});
