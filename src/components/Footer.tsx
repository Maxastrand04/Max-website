import type { ReactNode } from "react";

/**
 * The site footer, shown at the bottom of every page by the root layout.
 *
 * Renders a `<footer>` (the `contentinfo` landmark) holding two links in
 * this order:
 * - "GitHub", to a profile URL starting with `https://github.com/`, and
 * - "LinkedIn", to a profile URL starting with `https://www.linkedin.com/in/`.
 *
 * Both are plain `<a>` links that open in the same tab. The profile URLs are
 * placeholders (`https://github.com/example`,
 * `https://www.linkedin.com/in/example`) until the owner supplies the real
 * ones.
 *
 * Takes no props. Synchronous, per PCR-0002. No side effects.
 *
 * @returns The footer element.
 */
export function Footer(): ReactNode {
  return (
    <footer>
      <a href="https://github.com/example">GitHub</a>
      <a href="https://www.linkedin.com/in/example">LinkedIn</a>
    </footer>
  );
}
