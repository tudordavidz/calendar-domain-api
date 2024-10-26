module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true, // Enable coverage collection
  coverageDirectory: "coverage", // Output directory for coverage reports
  coverageThreshold: {
    global: {
      branches: 80, // Coverage percentage for branches
      functions: 80, // Coverage percentage for functions
      lines: 80, // Coverage percentage for lines
      statements: 80, // Coverage percentage for statements
    },
  },
  // Add other Jest configurations as needed
};
