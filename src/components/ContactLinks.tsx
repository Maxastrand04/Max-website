import type { ReactNode } from "react";
import type { ContactLinksContent } from "@/types/contact";

/**
 * The list of ways to reach the owner, shown on the contact page.
 *
 * Renders a `<ul>` with three links in this order:
 * - the email address as the link text, linking to `mailto:` plus that
 *   address, in the same tab so the visitor's mail app opens a new message,
 * - "GitHub", to `githubUrl`, in a new tab, and
 * - "LinkedIn", to `linkedinUrl`, in a new tab.
 *
 * The address shows as plain text, so a visitor with no mail app can copy
 * it. Layout only, apart from the fixed labels "GitHub" and "LinkedIn".
 *
 * Synchronous, per PCR-0002. No side effects.
 *
 * @param props - The links to show. All fields required.
 * @returns The list element.
 */
export function ContactLinks(props: ContactLinksContent): ReactNode {
  return (
    <ul>
      <li>
        <a href={`mailto:${props.email}`}>{props.email}</a>
      </li>
      <li>
        <a href={props.githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </li>
      <li>
        <a href={props.linkedinUrl} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </li>
    </ul>
  );
}
