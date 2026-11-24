import type { ReactNode } from "react";
import type { HeroContent } from "@/content/home";

/**
 * The hero section at the top of the home page.
 *
 * Renders a `<section>` named by its heading (the `region` landmark,
 * accessible name `name`), holding in this order:
 * - the photo, through `next/image`, with `alt` set to `photo.alt`, served
 *   as the file in `public/` unchanged, since static export has no image
 *   optimizer (PCR-0001),
 * - one `<h1>` with the text `name`,
 * - the text `title`, and
 * - a link with the text "Download CV" to `cv.href`, carrying the
 *   `download` attribute set to `cv.fileName`, so the browser saves the
 *   PDF under that name instead of opening it. It opens in the same tab.
 *
 * Layout only. It shows the strings it is given and adds no text of its
 * own besides "Download CV".
 *
 * Synchronous, per PCR-0002. No side effects.
 *
 * @param props - What the hero shows. All fields required.
 * @returns The hero section element.
 */
export function Hero(props: HeroContent): ReactNode {
  throw new Error("Not implemented");
}
