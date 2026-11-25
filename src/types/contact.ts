/**
 * Prop types for the owner's contact links. Lives outside `src/content/` so
 * components can import their props without importing content, per
 * ADR-0001.
 */

/** Every way to reach the owner, shown on the contact page. */
export type ContactLinksContent = {
  /**
   * The owner's public email address, such as `name@example.com`. Shown as
   * readable text and used in a `mailto:` link. Required, never empty.
   */
  email: string;
  /**
   * The owner's GitHub profile, starting with `https://github.com/`.
   * Required.
   */
  githubUrl: string;
  /**
   * The owner's LinkedIn profile, starting with
   * `https://www.linkedin.com/in/`. Required.
   */
  linkedinUrl: string;
};

/** The profile links the site footer shows. */
export type FooterLinks = Pick<ContactLinksContent, "githubUrl" | "linkedinUrl">;
