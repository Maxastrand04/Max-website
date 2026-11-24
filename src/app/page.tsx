import type { ReactNode } from "react";

import { Bio } from "@/components/Bio";
import { Hero } from "@/components/Hero";
import { homeContent } from "@/content/home";

/**
 * The home page, served at `/` and built to `out/index.html`.
 *
 * Renders, in this order and with nothing between them:
 * 1. the hero section ({@link Hero}), filled from `homeContent.hero`, and
 * 2. the bio section ({@link Bio}), filled from `homeContent.bio`.
 *
 * All text, the photo and the CV come from `homeContent` in
 * `src/content/home.ts`. This file holds layout only, so editing any of
 * that text never touches this file. The page's only `<h1>` is the owner's
 * name, inside the hero.
 *
 * It renders no header, footer or `<main>` of its own; the root layout
 * supplies those.
 *
 * Takes no props. Synchronous, per PCR-0002. No side effects.
 *
 * @returns The home page content.
 */
export default function HomePage(): ReactNode {
  return (
    <>
      <Hero {...homeContent.hero} />
      <Bio {...homeContent.bio} />
    </>
  );
}
