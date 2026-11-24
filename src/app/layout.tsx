import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

/**
 * Props for {@link RootLayout}.
 */
type RootLayoutProps = {
  /** The page Next.js is rendering for the current URL. Required. */
  children: ReactNode;
};

/**
 * The shared layout. Next.js wraps every page, the not-found page included,
 * in this component.
 *
 * Renders `<html lang="en">` with a `<body>` holding, in this order:
 * the site header (`<header>`, the `banner` landmark), a `<main>` with
 * `children` in it and nothing else, and the site footer (`<footer>`, the
 * `contentinfo` landmark). The header and footer are identical on every page.
 *
 * Synchronous, per PCR-0002. Reads no data and has no side effects.
 *
 * @param props.children - The current page.
 * @returns The full document for that page.
 */
export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
