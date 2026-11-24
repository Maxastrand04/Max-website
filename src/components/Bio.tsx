import type { ReactNode } from "react";
import type { BioContent } from "@/types/home";

/**
 * The bio section, shown under the hero on the home page.
 *
 * Renders a `<section>` named by its heading (the `region` landmark,
 * accessible name `heading`), holding one `<h2>` with the text `heading`,
 * then one `<p>` per entry in `paragraphs`, in the same order.
 *
 * Layout only. It shows the strings it is given and adds no text of its
 * own.
 *
 * Synchronous, per PCR-0002. No side effects.
 *
 * @param props - What the bio shows. All fields required.
 * @returns The bio section element.
 */
export function Bio(props: BioContent): ReactNode {
  return (
    <section aria-label={props.heading}>
      <h2>{props.heading}</h2>
      {props.paragraphs.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </section>
  );
}
