/**
 * The owner's contact links, the one source for both the contact page and
 * the site footer. Editing a link here changes it everywhere.
 *
 * The prop type lives in `@/types/contact` and is re-exported here.
 */

import type { ContactLinksContent } from "@/types/contact";

export type { ContactLinksContent } from "@/types/contact";

/** The owner's contact links. */
export const contactLinks: ContactLinksContent = {
  email: "maxastrand04@hotmail.com",
  githubUrl: "https://github.com/Maxastrand04",
  linkedinUrl: "https://www.linkedin.com/in/max-%C3%A5strand-1a61113a0/",
};
