import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RootLayout from "@/app/layout";
import ContactPage from "@/app/contact/page";

describe("ContactPage", () => {
  it("shows the Contact heading inside the page content", () => {
    render(<RootLayout><ContactPage /></RootLayout>, { container: document });
    expect(
      within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "Contact" }),
    ).toBeInTheDocument();
  });

  it("shows placeholder text inside the page content", () => {
    render(<RootLayout><ContactPage /></RootLayout>, { container: document });
    const text = within(screen.getByRole("main"))
      .getAllByRole("paragraph")
      .map((p) => p.textContent?.trim() ?? "");
    expect(text.some((t) => t.length > 0)).toBe(true);
  });
});
