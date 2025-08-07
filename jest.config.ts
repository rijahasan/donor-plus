// jest.config.ts
import nextJest from 'next/jest';

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@/components/(.*)$': '<rootDir>/app/components/$1',
    },
};

export default createJestConfig(customJestConfig);
