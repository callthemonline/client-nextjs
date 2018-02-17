module.exports = {
  trailingComma: "all",
  arrowParens: "always",
  overrides: [
    {
      files: "*.md",
      options: {
        tabWidth: 4, // https://github.com/prettier/prettier/pull/3990
      },
    },
  ],
};
