/**
 * Text and file references for the home page, kept apart from layout so
 * changing any of it never touches a component or page file.
 *
 * The prop types live in `@/types/home`. They are re-exported here so
 * existing imports from this module keep working.
 */

import type { BioContent, HeroContent } from "@/types/home";

export type { BioContent, Cv, HeroContent, Photo } from "@/types/home";

/** All content on the home page, one entry per section. */
export type HomeContent = {
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
