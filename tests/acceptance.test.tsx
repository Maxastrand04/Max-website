import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeAll, describe, expect, it } from "vitest";

import ContactPage from "@/app/contact/page";
import RootLayout from "@/app/layout";
import NotFound from "@/app/not-found";
import HomePage from "@/app/page";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

/** Renders a page inside the root layout, the way Next.js serves it. */
function renderInLayout(page: ReactNode) {
  return render(<RootLayout>{page}</RootLayout>, { container: document });
}

function main() {
  return screen.getByRole("main");
}

describe("shared layout", () => {
  it("sets the document language to English", () => {
    renderInLayout(<HomePage />);
    expect(document.documentElement).toHaveAttribute("lang", "en");
  });

  it("shows the header on the home page", () => {
    renderInLayout(<HomePage />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("shows the footer on the home page", () => {
    renderInLayout(<HomePage />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("puts the header before the page content", () => {
    renderInLayout(<HomePage />);
    const order = screen.getByRole("banner").compareDocumentPosition(main());
    expect(order & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("puts the footer after the page content", () => {
    renderInLayout(<HomePage />);
    const order = main().compareDocumentPosition(screen.getByRole("contentinfo"));
    expect(order & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("shows the same header on the contact page as on the home page", () => {
    const view = renderInLayout(<HomePage />);
    const homeHeader = screen.getByRole("banner").outerHTML;
    view.rerender(<RootLayout><ContactPage /></RootLayout>);
    expect(screen.getByRole("banner").outerHTML).toBe(homeHeader);
  });

  it("shows the same footer on the contact page as on the home page", () => {
    const view = renderInLayout(<HomePage />);
    const homeFooter = screen.getByRole("contentinfo").outerHTML;
    view.rerender(<RootLayout><ContactPage /></RootLayout>);
    expect(screen.getByRole("contentinfo").outerHTML).toBe(homeFooter);
  });
});

describe("header", () => {
  it("links the owner's name to the home page", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Max Åstrand" })).toHaveAttribute("href", "/");
  });

  it("links Home in the nav to the home page", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation");
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  });

  it("links Contact in the nav to the contact page", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation");
    expect(within(nav).getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("lists Home before Contact in the nav", () => {
    render(<Header />);
    const names = within(screen.getByRole("navigation"))
      .getAllByRole("link")
      .map((link) => link.textContent);
    expect(names).toEqual(["Home", "Contact"]);
  });
});

describe("footer", () => {
  it("links to a GitHub profile", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "GitHub" }).getAttribute("href")).toMatch(
      /^https:\/\/github\.com\/.+/,
    );
  });

  it("links to a LinkedIn profile", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "LinkedIn" }).getAttribute("href")).toMatch(
      /^https:\/\/www\.linkedin\.com\/in\/.+/,
    );
  });

  it("lists GitHub before LinkedIn", () => {
    render(<Footer />);
    const names = screen.getAllByRole("link").map((link) => link.textContent);
    expect(names).toEqual(["GitHub", "LinkedIn"]);
  });

  it("opens profile links in the same tab", () => {
    render(<Footer />);
    const targets = screen.getAllByRole("link").map((link) => link.getAttribute("target"));
    expect(targets).toEqual([null, null]);
  });
});

describe("home page", () => {
  it("shows the Home heading inside the page content", () => {
    renderInLayout(<HomePage />);
    expect(within(main()).getByRole("heading", { level: 1, name: "Home" })).toBeInTheDocument();
  });

  it("shows placeholder text inside the page content", () => {
    renderInLayout(<HomePage />);
    const text = within(main())
      .getAllByRole("paragraph")
      .map((p) => p.textContent?.trim() ?? "");
    expect(text.some((t) => t.length > 0)).toBe(true);
  });
});

describe("contact page", () => {
  it("shows the Contact heading inside the page content", () => {
    renderInLayout(<ContactPage />);
    expect(
      within(main()).getByRole("heading", { level: 1, name: "Contact" }),
    ).toBeInTheDocument();
  });

  it("shows placeholder text inside the page content", () => {
    renderInLayout(<ContactPage />);
    const text = within(main())
      .getAllByRole("paragraph")
      .map((p) => p.textContent?.trim() ?? "");
    expect(text.some((t) => t.length > 0)).toBe(true);
  });
});

describe("not-found page", () => {
  it("shows the Page not found heading inside the page content", () => {
    renderInLayout(<NotFound />);
    expect(
      within(main()).getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeInTheDocument();
  });

  it("links back to the home page", () => {
    renderInLayout(<NotFound />);
    expect(within(main()).getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});

describe("production build", () => {
  const root = join(__dirname, "..");
  const out = join(root, "out");

  beforeAll(() => {
    rmSync(out, { recursive: true, force: true });
    spawnSync("npx", ["next", "build"], { cwd: root, stdio: "ignore" });
  }, 180_000);

  it("writes an HTML page for home", () => {
    expect(existsSync(join(out, "index.html"))).toBe(true);
  });

  it("writes an HTML page for contact", () => {
    expect(existsSync(join(out, "contact.html"))).toBe(true);
  });

  it("writes a not-found page that static hosts serve for unknown paths", () => {
    expect(existsSync(join(out, "404.html"))).toBe(true);
  });

  it("puts the not-found message in the built 404 page, not a blank screen", () => {
    const html = existsSync(join(out, "404.html"))
      ? readFileSync(join(out, "404.html"), "utf8")
      : "";
    expect(html).toContain("Page not found");
  });
});
