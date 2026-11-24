import { existsSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RootLayout from "@/app/layout";
import HomePage from "@/app/page";
import { Bio } from "@/components/Bio";
import { Hero } from "@/components/Hero";
import type { BioContent, HeroContent } from "@/content/home";

const publicDir = join(__dirname, "..", "public");

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

const heroFixture: HeroContent = {
  name: "Ada Lovelace",
  title: "Analyst",
  photo: { src: "/ada.jpg", alt: "Portrait of Ada Lovelace", width: 200, height: 300 },
  cv: { href: "/ada.pdf", fileName: "Ada-Lovelace-CV.pdf" },
};

const bioFixture: BioContent = {
  heading: "Background",
  paragraphs: ["First paragraph.", "Second paragraph.", "Third paragraph."],
};

describe("home page hero", () => {
  it("shows the owner's name as the page's main heading", () => {
    const main = renderHome();
    expect(main.getByRole("heading", { level: 1 })).toHaveTextContent("Max Åstrand");
  });

  it("has exactly one main heading", () => {
    const main = renderHome();
    expect(main.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("no longer shows the old Home placeholder heading", () => {
    const main = renderHome();
    expect(main.queryByRole("heading", { name: "Home" })).not.toBeInTheDocument();
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

describe("CV download", () => {
  it("offers a Download CV link in the hero", () => {
    expect(within(heroRegion()).getByRole("link", { name: "Download CV" })).toBeInTheDocument();
  });

  it("links to a PDF that exists in public/", () => {
    const href = within(heroRegion()).getByRole("link", { name: "Download CV" }).getAttribute("href") ?? "";
    expect(existsSync(join(publicDir, href))).toBe(true);
  });

  it("tells the browser to download the file rather than open it", () => {
    const link = within(heroRegion()).getByRole("link", { name: "Download CV" });
    expect(link).toHaveAttribute("download");
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

describe("home page bio", () => {
  it("shows the bio section with its heading", () => {
    const main = renderHome();
    expect(main.getByRole("region", { name: "About" })).toBeInTheDocument();
  });

  it("shows non-empty placeholder text in the bio", () => {
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

describe("Hero shows the content it is given", () => {
  it("shows the given name as the main heading", () => {
    render(<Hero {...heroFixture} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ada Lovelace");
  });

  it("shows the given title", () => {
    render(<Hero {...heroFixture} />);
    expect(screen.getByText("Analyst")).toBeInTheDocument();
  });

  it("uses the given alt text for the photo", () => {
    render(<Hero {...heroFixture} />);
    expect(screen.getByRole("img", { name: "Portrait of Ada Lovelace" })).toBeInTheDocument();
  });

  it("shows the photo file it is given, unchanged", () => {
    render(<Hero {...heroFixture} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/ada.jpg");
  });

  it("links Download CV to the given CV path", () => {
    render(<Hero {...heroFixture} />);
    expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute("href", "/ada.pdf");
  });

  it("downloads the CV under the given file name", () => {
    render(<Hero {...heroFixture} />);
    expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute(
      "download",
      "Ada-Lovelace-CV.pdf",
    );
  });

  it("names its section after the given name", () => {
    render(<Hero {...heroFixture} />);
    expect(screen.getByRole("region", { name: "Ada Lovelace" })).toBeInTheDocument();
  });
});

describe("Bio shows the content it is given", () => {
  it("shows the given heading as a second-level heading", () => {
    render(<Bio {...bioFixture} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Background");
  });

  it("shows every given paragraph in order", () => {
    render(<Bio {...bioFixture} />);
    const text = screen.getAllByRole("paragraph").map((p) => p.textContent);
    expect(text).toEqual(bioFixture.paragraphs);
  });

  it("shows a single paragraph when given one", () => {
    render(<Bio heading="Background" paragraphs={["Only one."]} />);
    expect(screen.getAllByRole("paragraph").map((p) => p.textContent)).toEqual(["Only one."]);
  });

  it("names its section after the given heading", () => {
    render(<Bio {...bioFixture} />);
    expect(screen.getByRole("region", { name: "Background" })).toBeInTheDocument();
  });
});
