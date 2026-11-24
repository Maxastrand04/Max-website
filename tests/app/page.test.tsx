import { existsSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RootLayout from "@/app/layout";
import HomePage from "@/app/page";

const publicDir = join(__dirname, "..", "..", "public");

/** Renders the home page inside the root layout, the way Next.js serves it. */
function renderHome() {
  render(<RootLayout><HomePage /></RootLayout>, { container: document });
  return within(screen.getByRole("main"));
}

/** The hero section, found by its accessible name, the owner's name. */
function heroRegion() {
  return renderHome().getByRole("region", { name: "Max Åstrand" });
}

/** True when `a` comes before `b` in the document. */
function precedes(a: Element, b: Element) {
  return Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
}

describe("HomePage hero", () => {
  it("shows the owner's name as the page's main heading", () => {
    const main = renderHome();
    expect(main.getByRole("heading", { level: 1 })).toHaveTextContent("Max Åstrand");
  });

  it("has exactly one main heading", () => {
    const main = renderHome();
    expect(main.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("shows the title Platform engineer in the hero", () => {
    expect(within(heroRegion()).getByText("Platform engineer")).toBeInTheDocument();
  });

  it("shows a photo whose alt text names the owner", () => {
    expect(within(heroRegion()).getByRole("img", { name: /Max Åstrand/ })).toBeInTheDocument();
  });

  it("serves the photo from a file that exists in public/", () => {
    const src = within(heroRegion()).getByRole("img").getAttribute("src") ?? "";
    expect(existsSync(join(publicDir, src))).toBe(true);
  });

  it("puts the photo before the name", () => {
    const hero = within(heroRegion());
    expect(precedes(hero.getByRole("img"), hero.getByRole("heading", { level: 1 }))).toBe(true);
  });

  it("puts the hero before anything else in the page content", () => {
    const main = renderHome();
    const hero = main.getByRole("region", { name: "Max Åstrand" });
    expect(screen.getByRole("main").firstElementChild).toBe(hero);
  });
});

describe("HomePage CV download", () => {
  it("offers a Download CV link in the hero", () => {
    expect(within(heroRegion()).getByRole("link", { name: "Download CV" })).toBeInTheDocument();
  });

  it("links to a PDF that exists in public/", () => {
    const href = within(heroRegion()).getByRole("link", { name: "Download CV" }).getAttribute("href") ?? "";
    expect(existsSync(join(publicDir, href))).toBe(true);
  });

  it("links to a .pdf file", () => {
    const link = within(heroRegion()).getByRole("link", { name: "Download CV" });
    expect(link.getAttribute("href")).toMatch(/\.pdf$/);
  });

  it("saves the file under a name made from the owner's name and CV", () => {
    const link = within(heroRegion()).getByRole("link", { name: "Download CV" });
    expect(link.getAttribute("download")).toMatch(/^Max-[AÅ]strand-CV\.pdf$/);
  });

  it("starts the download in the same tab", () => {
    const link = within(heroRegion()).getByRole("link", { name: "Download CV" });
    expect(link).not.toHaveAttribute("target");
  });
});

describe("HomePage bio", () => {
  it("shows the bio section with its heading", () => {
    const main = renderHome();
    expect(main.getByRole("region", { name: "About" })).toBeInTheDocument();
  });

  it("shows non-empty text in the bio", () => {
    const bio = renderHome().getByRole("region", { name: "About" });
    const text = within(bio).getAllByRole("paragraph").map((p) => p.textContent?.trim() ?? "");
    expect(text.some((t) => t.length > 0)).toBe(true);
  });

  it("puts the bio below the hero", () => {
    const main = renderHome();
    const hero = main.getByRole("region", { name: "Max Åstrand" });
    expect(precedes(hero, main.getByRole("region", { name: "About" }))).toBe(true);
  });
});
