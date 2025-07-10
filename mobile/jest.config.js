module.exports = {
  preset: "react-native",
  testRunner: "jest-circus/runner",
  testMatch: ["<rootDir>/src/**/*.test.tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFiles: ["./jestSetup.js"],
  
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community|react-native-image-picker|react-native-document-picker|react-redux)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/services/itemService$": "<rootDir>/src/services/__mocks__/itemService.ts",
  },
};