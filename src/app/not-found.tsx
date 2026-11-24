import type { ReactNode } from "react";

/**
 * The not-found page, shown for any path that matches no page. Static
 * export builds it to `out/404.html`, which static hosts serve for unknown
 * paths.
 *
 * Renders one `<h1>` with the text "Page not found" and a `next/link` link
 * with the text "Back to home" that goes to `/`. The root layout wraps it
 * like any other page, so the header and footer show too.
 *
 * Takes no props. Synchronous, per PCR-0002. No side effects.
 *
 * @returns The not-found page content.
 */
export default function NotFound(): ReactNode {
  throw new Error("Not implemented");
}
