import type { ReactNode } from "react";

/**
 * The contact page, served at `/contact` and built to `out/contact.html`.
 *
 * Placeholder until real content lands. Renders one `<h1>` with the text
 * "Contact", followed by at least one paragraph of placeholder text. It has
 * no contact links yet (ticket 1.4). It renders no header, footer or
 * `<main>` of its own; the root layout supplies those.
 *
 * Takes no props. Synchronous, per PCR-0002. No side effects.
 *
 * @returns The contact page content.
 */
export default function ContactPage(): ReactNode {
  return (
    <>
      <h1>Contact</h1>
      <p>Placeholder text for the contact page.</p>
    </>
  );
}
