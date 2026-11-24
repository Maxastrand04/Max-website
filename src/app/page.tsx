import type { ReactNode } from "react";

/**
 * The home page, served at `/` and built to `out/index.html`.
 *
 * Placeholder until real content lands. Renders one `<h1>` with the text
 * "Home", followed by at least one paragraph of placeholder text. It renders
 * no header, footer or `<main>` of its own; the root layout supplies those.
 *
 * Takes no props. Synchronous, per PCR-0002. No side effects.
 *
 * @returns The home page content.
 */
export default function HomePage(): ReactNode {
  throw new Error("Not implemented");
}
