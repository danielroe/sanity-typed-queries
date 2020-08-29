module.exports = {
  preset: '@siroc/jest-preset',
  verbose: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ['test', '.babelrc.js', 'lib/'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
