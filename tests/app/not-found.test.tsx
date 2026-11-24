import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RootLayout from "@/app/layout";
import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("shows the Page not found heading inside the page content", () => {
    render(<RootLayout><NotFound /></RootLayout>, { container: document });
    expect(
      within(screen.getByRole("main")).getByRole("heading", {
        level: 1,
        name: "Page not found",
      }),
    ).toBeInTheDocument();
  });

  it("links back to the home page", () => {
    render(<RootLayout><NotFound /></RootLayout>, { container: document });
    expect(
      within(screen.getByRole("main")).getByRole("link", { name: "Back to home" }),
    ).toHaveAttribute("href", "/");
  });
});
