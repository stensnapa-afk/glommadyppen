import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Build-sha + versjon bakes inn ved bygg. Leses av /api/version (helse-probe).
function buildSha(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "unknown";
  }
}
const pkg = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf8"));

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://hydapi.nve.no https://api.met.no",
      "font-src 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  env: { BUILD_SHA: buildSha(), APP_VERSION: pkg.version },
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withSentryConfig(nextConfig, {
  org: "snapadev",
  project: "glommadyppen",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  tunnelRoute: "/monitoring",
  silent: !process.env.CI,
});
