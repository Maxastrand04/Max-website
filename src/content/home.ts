/**
 * Text and file references for the home page, kept apart from layout so
 * changing any of it never touches a component or page file.
 *
 * The section prop types live in `@/types/home`. `BioContent` and
 * `HeroContent` are re-exported here so callers can import them from either
 * module.
 */

import type { BioContent, HeroContent } from "@/types/home";

export type { BioContent, HeroContent } from "@/types/home";

/** All content on the home page, one entry per section. */
type HomeContent = {
  /** Required. */
  hero: HeroContent;
  /** Required. */
  bio: BioContent;
};

/**
 * The home page's content. Edit the text here, never in a component.
 *
 * The photo and CV are placeholders until the owner supplies the real
 * files; replacing them means swapping the files in `public/` and, if the
 * new photo's size differs, updating `width` and `height`.
 */
export const homeContent: HomeContent = {
  hero: {
    name: "Max Åstrand",
    title: "Platform engineer",
    photo: {
      src: "/photo.jpg",
      alt: "Portrait of Max Åstrand",
      width: 400,
      height: 400,
    },
    cv: {
      href: "/cv.pdf",
      fileName: "Max-Astrand-CV.pdf",
    },
  },
  bio: {
    heading: "About",
    paragraphs: [
      "Placeholder bio. The real one is still being written.",
    ],
  },
};
