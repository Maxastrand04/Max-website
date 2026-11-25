import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "@/components/Footer";

const links = {
  githubUrl: "https://github.com/someone",
  linkedinUrl: "https://www.linkedin.com/in/someone",
};

describe("Footer", () => {
  it("links GitHub to the given profile", () => {
    render(<Footer {...links} />);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      links.githubUrl,
    );
  });

  it("links LinkedIn to the given profile", () => {
    render(<Footer {...links} />);
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      links.linkedinUrl,
    );
  });

  it("lists GitHub before LinkedIn", () => {
    render(<Footer {...links} />);
    const names = screen.getAllByRole("link").map((link) => link.textContent);
    expect(names).toEqual(["GitHub", "LinkedIn"]);
  });

  it("opens profile links in a new tab", () => {
    render(<Footer {...links} />);
    const targets = screen.getAllByRole("link").map((link) => link.getAttribute("target"));
    expect(targets).toEqual(["_blank", "_blank"]);
  });
});
