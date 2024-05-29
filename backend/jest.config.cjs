module.exports = {
  extends: "./tsconfig.json",
  compilerOptions: {
    "types": ["@types/jest"]
  },
  moduleNameMapper: {
    '^faiss-node$': 'test/__mocks__/faiss-node.js'
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/test/**/*.test.(ts|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    'faiss-node': '<rootDir>/test/__mocks__/faiss-node.js'
  }
};
