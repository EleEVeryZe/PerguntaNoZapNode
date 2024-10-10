const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('get-tsconfig').getTsconfig('./tsconfig.json')['config'];

module.exports = {
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "js"],
	testMatch: ["**/test/**/*.test.(ts|js)"],
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.json",
			},
		],
	},
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' })
};
