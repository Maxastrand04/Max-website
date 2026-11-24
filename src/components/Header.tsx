import type { ReactNode } from "react";
import Link from "next/link";

/**
 * The site header, shown at the top of every page by the root layout.
 *
 * Renders a `<header>` (the `banner` landmark) holding:
 * - a link with the text "Max Åstrand" that goes to `/`, and
 * - a `<nav>` (the `navigation` landmark) with two links in this order,
 *   "Home" to `/` and "Contact" to `/contact`.
 *
 * Links use `next/link`, so moving between pages in the browser doesn't
 * reload the whole document. The header is the same on every page and does
 * not mark which page is current.
 *
 * Takes no props. Synchronous, per PCR-0002. No side effects.
 *
 * @returns The header element.
 */
export function Header(): ReactNode {
  return (
    <header>
      <Link href="/">Max Åstrand</Link>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}
