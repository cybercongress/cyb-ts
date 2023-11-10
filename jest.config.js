const { TextDecoder, TextEncoder } = require('node:util');

module.exports = {
  globals: {
    TextDecoder,
    TextEncoder,
  },
  rootDir: './',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs)$': [
      'esbuild-jest',
      {
        sourcemap: true,
        loaders: {
          '.test.ts': 'tsx',
        },
      },
    ],
    '^.+\\.rn$': 'jest-text-transformer',
  },
  transformIgnorePatterns: ['/!node_modules\\/lodash-es/'],
  moduleDirectories: ['node_modules', 'src', 'rune_build'],
  modulePaths: [
    '<rootDir>',
    '<rootDir>/rune_build',
    '<rootDir>/node_modules',
    '<rootDir>/src',
  ],
  moduleFileExtensions: ['js', 'jsx', 'mjs', 'ts', 'tsx'],
  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/src/$1',
    '^rune$': '<rootDir>/rune_build',
    '#(.*)': '<rootDir>/node_modules/$1',
  },
  preset: 'ts-jest',
  resolver: 'ts-jest-resolver',
  // globals: {
  //   'ts-jest': {
  //     diagnostics: false,
  //   },
  // },
};
