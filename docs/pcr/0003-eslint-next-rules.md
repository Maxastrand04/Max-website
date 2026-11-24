# PCR-0003: Lint with ESLint and Next.js's recommended rules

**Decision:** The project MUST lint with ESLint using `eslint-config-next`, configured in `eslint.config.mjs` and run with `npm run lint`.

**Reason:** Linting is cheapest to adopt before there is code to fix, so the project has it from the first commit. Biome was weighed and lost: it is faster and also formats code, but it lacks Next.js's own rules, such as the ones that flag a raw `<img>` in place of `next/image` or a `<script>` tag that blocks page load, and `eslint-config-next` ships those.

**Consequence:** Code that breaks a rule is fixed or carries a disabling comment that names why, never left failing. The TypeScript version must stay one that `typescript-eslint` supports, which today rules out TypeScript 7. A switch to another linter means amending this record.

**Date:** 2026-11-24
