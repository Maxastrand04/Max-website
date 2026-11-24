import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

/** Reads a hex colour custom property such as --color-bg from the theme. */
function colour(name: string): string {
  const match = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`${name} is not a hex colour in globals.css`);
  return match[1];
}

/** WCAG 2.x relative luminance of a #rrggbb colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two #rrggbb colours. */
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("dark base theme", () => {
  const bg = colour("--color-bg");

  it("keeps body text at WCAG AA contrast (4.5:1) on the background", () => {
    expect(contrast(colour("--color-text"), bg)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps secondary text at WCAG AA contrast on the background", () => {
    expect(contrast(colour("--color-text-dim"), bg)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the blue accent at WCAG AA contrast on the background", () => {
    expect(contrast(colour("--color-accent"), bg)).toBeGreaterThanOrEqual(4.5);
  });

  it("makes secondary text dimmer than body text", () => {
    expect(luminance(colour("--color-text-dim"))).toBeLessThan(
      luminance(colour("--color-text")),
    );
  });

  it("uses a near-black background", () => {
    expect(luminance(bg)).toBeLessThan(0.02);
  });

  it("uses no shadows", () => {
    expect(css).not.toMatch(/box-shadow|text-shadow/);
  });
});
