/**
 * Prop types for the home page sections. Lives outside `src/content/` so
 * section components can import their props without importing content,
 * per ADR-0001. Content and page files import these types from here.
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
