# PCR-0001: Build the site with Next.js static export in TypeScript

**Decision:** The website MUST be a Next.js app written in TypeScript, built with static export, so the build output is plain files any static host can serve.

**Reason:** The owner already knows React, and Next.js adds build-time data fetching and per-page meta tags without extra plumbing. Astro was weighed and lost because it means learning a new templating format on launch day. Vite + React lost because it is a single-page app, so link-preview bots that don't run JavaScript see one shared preview for every page, and build-time GitHub data needs a hand-written script. Plain JavaScript lost to TypeScript because the type checker catches mistakes before the browser does.

**Consequence:** No page may depend on code running on a server at request time, since static export has no server. Data from outside sources, like GitHub, is fetched at build time. Anything that needs a live server waits for a separate backend service, which can be written in any language, or for static export to be switched off through an amendment to this record.

**Date:** 2026-11-24
