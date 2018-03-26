const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const withCss = require("@zeit/next-css");
const withTypescript = require("@zeit/next-typescript");
const withPlugins = require("next-compose-plugins");

module.exports = withPlugins(
  [
    withTypescript,
    withCss,
    [
      withBundleAnalyzer,
      {
        analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
        analyzeBrowser: ["browser", "both"].includes(
          process.env.BUNDLE_ANALYZE,
        ),
      },
    ],
  ],
  {
    distDir: "../.next",
  },
);
