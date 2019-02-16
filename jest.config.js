module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: false,
  globalSetup: "./test/setup.ts",
  globalTeardown: "./test/tearDown.ts",
  bail: true
};
