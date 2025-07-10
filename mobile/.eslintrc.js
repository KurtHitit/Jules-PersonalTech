module.exports = {
  root: true,
  extends: ["@react-native", "prettier"],
  parserOptions: {
    requireConfigFile: true, // This tells ESLint to look for a Babel config file
    babelOptions: {
      configFile: "./babel.config.js", // Specify the path to your babel.config.js
    },
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "lf",
        singleQuote: false, // Use double quotes for consistency with existing code
      },
    ],
    // Add other rules as needed
  },
};
