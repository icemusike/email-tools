/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$_': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$_': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
}; 