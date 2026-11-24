import { existsSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

describe("static export build", () => {
  const root = join(__dirname, "..");
  const out = join(root, "out");

  beforeAll(() => {
    rmSync(out, { recursive: true, force: true });
    spawnSync("npx", ["next", "build"], { cwd: root, stdio: "ignore" });
  }, 180_000);

  it("writes an HTML page for home", () => {
    expect(existsSync(join(out, "index.html"))).toBe(true);
  });

  it("writes an HTML page for contact", () => {
    expect(existsSync(join(out, "contact.html"))).toBe(true);
  });

  it("writes a not-found page that static hosts serve for unknown paths", () => {
    expect(existsSync(join(out, "404.html"))).toBe(true);
  });

  it("puts the not-found message in the built 404 page, not a blank screen", () => {
    expect(readFileSync(join(out, "404.html"), "utf8")).toContain("Page not found");
  });
});
