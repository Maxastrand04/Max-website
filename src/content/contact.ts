/**
 * The owner's contact links, the one source for both the contact page and
 * the site footer. Editing a link here changes it everywhere.
 *
 * The prop type lives in `@/types/contact` and is re-exported here.
 */

import type { ContactLinksContent } from "@/types/contact";

export type { ContactLinksContent } from "@/types/contact";

/**
 * The owner's contact links.
 *
 * `email` and `linkedinUrl` are placeholders until the owner supplies the
 * real ones.
 */
export const contactLinks: ContactLinksContent = {
  email: "hello@example.com",
  githubUrl: "https://github.com/Maxastrand04",
  linkedinUrl: "https://www.linkedin.com/in/example",
};
