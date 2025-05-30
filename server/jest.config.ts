import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

const esmPreset = createDefaultEsmPreset({
  tsconfig: 'tsconfig.jest.json',
  diagnostics: {
    pretty: true,
  },
});

const presetConfig: Config = {
  ...esmPreset,
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: ['node_modules'],
  testPathIgnorePatterns: ['node_modules'],
  coveragePathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node',
};

export default {
  ...presetConfig,
} satisfies Config;
