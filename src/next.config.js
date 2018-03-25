const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const withTypescript = require("@zeit/next-typescript");
const withCss = require("@zeit/next-css");

module.exports = withTypescript(
  withCss(
    withBundleAnalyzer({
      distDir: "../.next",
      analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
      analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
    }),
  ),
);
