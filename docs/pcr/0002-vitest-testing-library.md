# PCR-0002: Test with Vitest and React Testing Library in jsdom

**Decision:** Tests MUST run on Vitest, render components with React Testing Library in jsdom, live under `tests/`, and run with `npm test`.

**Reason:** Vitest runs TypeScript with no extra setup and is faster than Jest, which was weighed and lost for being slower and needing more config to handle TypeScript and ES modules. Playwright end-to-end tests lost for now because the site has only links between static pages, so a real browser catches almost nothing a rendered component test misses, and it adds a browser download and a second runner.

**Consequence:** Vitest cannot render an `async` React Server Component, so every page and component must stay synchronous while this record stands. The first `async` component, such as one fetching GitHub data at build time, means amending this record before it lands, for example to add Playwright tests against the built site. Tests check what a user sees, by visible text, link names and link targets, not by component internals.

**Date:** 2026-11-24
