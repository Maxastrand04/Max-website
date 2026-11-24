import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Header } from "@/components/Header";

describe("Header", () => {
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
