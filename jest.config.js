module.exports = {
	// Automatically clear mock calls and instances between every test
	clearMocks: true,

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: true,

	// An array of glob patterns indicating a set of files for which coverage information should be collected
	collectCoverageFrom: ["dist/**/*.js"],

	// The directory where Jest should output its coverage files
	coverageDirectory: "coverage",

	// A list of reporter names that Jest uses when writing coverage reports
	coverageReporters: ["text", "lcov"],

	// Make calling deprecated APIs throw helpful error messages
	errorOnDeprecated: false,

	// A set of global variables that need to be available in all test environments
	// globals: {},

	// Automatically reset mock state between every test
	resetMocks: true,

	// The test environment that will be used for testing
	testEnvironment: "node",

	// An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
	testPathIgnorePatterns: [".eslintrc.js"],
}
