/**
 * Text and file references for the home page, kept apart from layout so
 * changing any of it never touches a component or page file.
 */

/** The owner's photo, a file in `public/`. */
export type Photo = {
  /** Site-root path to the image, such as `/photo.jpg`. Required. */
  src: string;
  /**
   * Alt text naming the owner, read by screen readers and shown when the
   * image fails to load. Required, never empty.
   */
  alt: string;
  /** The image file's width in pixels. Required, positive. */
  width: number;
  /** The image file's height in pixels. Required, positive. */
  height: number;
};

/** The owner's CV, a PDF in `public/`. */
export type Cv = {
  /** Site-root path to the PDF, such as `/cv.pdf`. Required. */
  href: string;
  /**
   * The name the browser saves the download under. Made from the owner's
   * name and "CV", ending in `.pdf`, such as `Max-Astrand-CV.pdf`.
   * Required.
   */
  fileName: string;
};

/** Everything the hero section shows. */
export type HeroContent = {
  /** The owner's full name. Required, never empty. */
  name: string;
  /** The owner's job title, such as "Platform engineer". Required. */
  title: string;
  /** Required. */
  photo: Photo;
  /** Required. */
  cv: Cv;
};

/** Everything the bio section shows. */
export type BioContent = {
  /** The section's heading, such as "About". Required, never empty. */
  heading: string;
  /**
   * The bio text, one string per paragraph, in reading order. Required,
   * at least one entry, none empty. Placeholder text until the real bio
   * is written.
   */
  paragraphs: string[];
};

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
