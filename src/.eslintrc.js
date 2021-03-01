module.exports = {
	env: {
		es6: true,
		node: true,
	},
	parser: "@typescript-eslint/parser",
	extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended", "prettier"],
	plugins: ["prettier"],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module",
	},
	rules: {
		"@typescript-eslint/camelcase": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-member-accessibility": "off",
		"prettier/prettier": "error",
	},
}
