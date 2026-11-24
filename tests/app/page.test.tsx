import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RootLayout from "@/app/layout";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("shows the Home heading inside the page content", () => {
    render(<RootLayout><HomePage /></RootLayout>, { container: document });
    expect(
      within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "Home" }),
    ).toBeInTheDocument();
  });

  it("shows placeholder text inside the page content", () => {
    render(<RootLayout><HomePage /></RootLayout>, { container: document });
    const text = within(screen.getByRole("main"))
      .getAllByRole("paragraph")
      .map((p) => p.textContent?.trim() ?? "");
    expect(text.some((t) => t.length > 0)).toBe(true);
  });
});
