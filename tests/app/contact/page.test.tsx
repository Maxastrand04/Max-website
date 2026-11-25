import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RootLayout from "@/app/layout";
import ContactPage from "@/app/contact/page";
import { contactLinks } from "@/content/contact";

/** Renders the contact page inside the root layout, the way Next.js serves it. */
function renderContact() {
  render(<RootLayout><ContactPage /></RootLayout>, { container: document });
  return within(screen.getByRole("main"));
}

describe("ContactPage", () => {
  it("shows the Contact heading inside the page content", () => {
    const main = renderContact();
    expect(main.getByRole("heading", { level: 1, name: "Contact" })).toBeInTheDocument();
  });

  it("shows the email address as readable link text", () => {
    const main = renderContact();
    expect(main.getByRole("link", { name: contactLinks.email })).toBeInTheDocument();
  });

  it("links the email address to a new message addressed to the owner", () => {
    const main = renderContact();
    expect(main.getByRole("link", { name: contactLinks.email })).toHaveAttribute(
      "href",
      `mailto:${contactLinks.email}`,
    );
  });

  it("opens the email link in the same tab, so the mail app handles it", () => {
    const main = renderContact();
    expect(main.getByRole("link", { name: contactLinks.email })).not.toHaveAttribute("target");
  });

  it("links GitHub to the owner's profile in a new tab", () => {
    const link = renderContact().getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("href", contactLinks.githubUrl);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("links LinkedIn to the owner's profile in a new tab", () => {
    const link = renderContact().getByRole("link", { name: "LinkedIn" });
    expect(link).toHaveAttribute("href", contactLinks.linkedinUrl);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("lists email, then GitHub, then LinkedIn", () => {
    const names = renderContact()
      .getAllByRole("link")
      .map((link) => link.textContent);
    expect(names).toEqual([contactLinks.email, "GitHub", "LinkedIn"]);
  });

  it("shows the same GitHub and LinkedIn links as the footer", () => {
    renderContact();
    const footer = within(screen.getByRole("contentinfo"));
    const main = within(screen.getByRole("main"));
    for (const name of ["GitHub", "LinkedIn"]) {
      expect(main.getByRole("link", { name }).getAttribute("href")).toBe(
        footer.getByRole("link", { name }).getAttribute("href"),
      );
    }
  });
});

describe("contactLinks", () => {
  it("has an email address", () => {
    expect(contactLinks.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });

  it("points GitHub at a github.com profile", () => {
    expect(contactLinks.githubUrl).toMatch(/^https:\/\/github\.com\/.+/);
  });

  it("points LinkedIn at a linkedin.com profile", () => {
    expect(contactLinks.linkedinUrl).toMatch(/^https:\/\/www\.linkedin\.com\/in\/.+/);
  });
});
