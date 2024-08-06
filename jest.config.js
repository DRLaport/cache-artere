module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: ['**/tests/**/*.ts'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testEnvironment: 'node',
};
  