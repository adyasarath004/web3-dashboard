 // jest.config.js
module.exports = {
  testEnvironment: 'jsdom', // simulates a browser environment for tests
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
}