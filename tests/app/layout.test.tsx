import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import ContactPage from "@/app/contact/page";
import RootLayout from "@/app/layout";
import HomePage from "@/app/page";

/** Renders a page inside the root layout, the way Next.js serves it. */
function renderInLayout(page: ReactNode) {
  return render(<RootLayout>{page}</RootLayout>, { container: document });
}

function main() {
  return screen.getByRole("main");
}

describe("RootLayout", () => {
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
