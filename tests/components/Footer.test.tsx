import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "@/components/Footer";

describe("Footer", () => {
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
