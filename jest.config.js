module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: false,
  globalSetup: "./test/setup.ts",
  globalTeardown: "./test/tearDown.ts",
  bail: true,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/out/'
  ],
  reporters: [
    "default",
    ["./node_modules/jest-html-reporter", {
        "pageTitle": "Test Report"
    }]
]
};
