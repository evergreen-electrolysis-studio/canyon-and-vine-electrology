import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    // Local migration artifacts and earlier scratch checkouts are not source.
    "dist/**",
    "work/**",
    ".wrangler/**",
    "outputs/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
