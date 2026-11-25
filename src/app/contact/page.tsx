import type { ReactNode } from "react";

import { ContactLinks } from "@/components/ContactLinks";
import { contactLinks } from "@/content/contact";

/**
 * The contact page, served at `/contact` and built to `out/contact.html`.
 *
 * Renders one `<h1>` with the text "Contact", then the contact links
 * ({@link ContactLinks}) filled from `contactLinks` in
 * `src/content/contact.ts`. It renders no header, footer or `<main>` of its
 * own; the root layout supplies those.
 *
 * Takes no props. Synchronous, per PCR-0002. No side effects.
 *
 * @returns The contact page content.
 */
export default function ContactPage(): ReactNode {
  return (
    <>
      <h1>Contact</h1>
      <ContactLinks {...contactLinks} />
    </>
  );
}
