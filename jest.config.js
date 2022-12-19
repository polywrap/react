module.exports = {
  collectCoverage: true,
  preset: "ts-jest",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  modulePathIgnorePatterns: ["./.polywrap", "./src/__tests__/test-cases"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
};
