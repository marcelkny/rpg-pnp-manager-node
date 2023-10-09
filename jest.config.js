/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    clearMocks: true,
    testEnvironment: "node",
    coverageDirectory: "coverage",
    coverageReporters: ["json", "lcov", "text", "clover", "cobertura", "text-summary"],
    collectCoverageFrom: ["./**/*.ts"],
    testMatch: ["./test/**/*.ts", "**/*.{spec,test}.ts", "**/__test__/*.ts"],
    testPathIgnorePatterns: ["/node_modules/"],
};
