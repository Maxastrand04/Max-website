import type { ReactNode } from "react";

/** Placeholder GitHub profile until the owner supplies the real URL. */
const GITHUB_PROFILE_URL = "https://github.com/example";

/** Placeholder LinkedIn profile until the owner supplies the real URL. */
const LINKEDIN_PROFILE_URL = "https://www.linkedin.com/in/example";

/**
 * The site footer, shown at the bottom of every page by the root layout.
 *
 * Renders a `<footer>` (the `contentinfo` landmark) holding two links in
 * this order:
 * - "GitHub", to a profile URL starting with `https://github.com/`, and
 * - "LinkedIn", to a profile URL starting with `https://www.linkedin.com/in/`.
 *
 * Both links open in the same tab. The profile URLs are placeholders until
 * the owner supplies the real ones.
 *
 * Takes no props. Synchronous, per PCR-0002. No side effects.
 *
 * @returns The footer element.
 */
export function Footer(): ReactNode {
  return (
    <footer>
      <a href={GITHUB_PROFILE_URL}>GitHub</a>
      <a href={LINKEDIN_PROFILE_URL}>LinkedIn</a>
    </footer>
  );
}
