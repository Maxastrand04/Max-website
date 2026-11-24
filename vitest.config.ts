import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Test setup for the site, per PCR-0002.
 *
 * Tests live under `tests/`, render components in jsdom with React Testing
 * Library, and import source through the same `@/` alias Next.js uses, so
 * `@/app/page` resolves to `src/app/page.tsx`.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/setup.ts"],
  },
});
