/**
 * Runs before every test file. Adds jest-dom matchers such as
 * `toBeInTheDocument` and `toHaveAttribute`, and unmounts whatever a test
 * rendered once it finishes so tests never see each other's output.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
