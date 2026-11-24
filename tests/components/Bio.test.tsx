import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Bio } from "@/components/Bio";
import type { BioContent } from "@/content/home";

const content: BioContent = {
  heading: "Background",
  paragraphs: ["First paragraph.", "Second paragraph.", "Third paragraph."],
};

describe("Bio", () => {
  it("shows the given heading as a second-level heading", () => {
    render(<Bio {...content} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Background");
  });

  it("shows every given paragraph in order", () => {
    render(<Bio {...content} />);
    const text = screen.getAllByRole("paragraph").map((p) => p.textContent);
    expect(text).toEqual(content.paragraphs);
  });

  it("shows a single paragraph when given one", () => {
    render(<Bio heading="Background" paragraphs={["Only one."]} />);
    expect(screen.getAllByRole("paragraph").map((p) => p.textContent)).toEqual(["Only one."]);
  });

  it("shows no paragraph when given none", () => {
    render(<Bio heading="Background" paragraphs={[]} />);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("names its section after the given heading", () => {
    render(<Bio {...content} />);
    expect(screen.getByRole("region", { name: "Background" })).toBeInTheDocument();
  });
});
