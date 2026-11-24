import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Hero } from "@/components/Hero";
import type { HeroContent } from "@/content/home";

const content: HeroContent = {
  name: "Ada Lovelace",
  title: "Analyst",
  photo: { src: "/ada.jpg", alt: "Portrait of Ada Lovelace", width: 200, height: 300 },
  cv: { href: "/ada.pdf", fileName: "Ada-Lovelace-CV.pdf" },
};

describe("Hero", () => {
  it("shows the given name as the main heading", () => {
    render(<Hero {...content} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ada Lovelace");
  });

  it("shows the given title", () => {
    render(<Hero {...content} />);
    expect(screen.getByText("Analyst")).toBeInTheDocument();
  });

  it("uses the given alt text for the photo", () => {
    render(<Hero {...content} />);
    expect(screen.getByRole("img", { name: "Portrait of Ada Lovelace" })).toBeInTheDocument();
  });

  it("shows the photo file it is given, unchanged", () => {
    render(<Hero {...content} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/ada.jpg");
  });

  it("links Download CV to the given CV path", () => {
    render(<Hero {...content} />);
    expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute("href", "/ada.pdf");
  });

  it("downloads the CV under the given file name", () => {
    render(<Hero {...content} />);
    expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute(
      "download",
      "Ada-Lovelace-CV.pdf",
    );
  });

  it("names its section after the given name", () => {
    render(<Hero {...content} />);
    expect(screen.getByRole("region", { name: "Ada Lovelace" })).toBeInTheDocument();
  });
});
