import type { ReactNode } from "react";
import type { FooterLinks } from "@/types/contact";

/**
 * The site footer, shown at the bottom of every page by the root layout.
 *
 * Renders a `<footer>` (the `contentinfo` landmark) holding two links in
 * this order, "GitHub" to `githubUrl` and "LinkedIn" to `linkedinUrl`.
 * Both open in a new tab, matching the same links on the contact page.
 *
 * The root layout fills the props from `contactLinks` in
 * `src/content/contact.ts`, so the footer and contact page always show the
 * same profiles.
 *
 * Synchronous, per PCR-0002. No side effects.
 *
 * @param props - The profile links. Both required.
 * @returns The footer element.
 */
export function Footer(props: FooterLinks): ReactNode {
  return (
    <footer>
      <a href={props.githubUrl} target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
      <a href={props.linkedinUrl} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
    </footer>
  );
}
