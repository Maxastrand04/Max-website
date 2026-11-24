import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * Lint rules for the site, per PCR-0003: Next.js's recommended rules,
 * Core Web Vitals checks, and its TypeScript rules. Run with `npm run lint`.
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // This rule only checks a Pages Router `pages/` folder, which this App
    // Router project doesn't have, so it can only print a warning.
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
  { ignores: ["node_modules/**", ".next/**", "out/**", "next-env.d.ts"] },
];

export default eslintConfig;
