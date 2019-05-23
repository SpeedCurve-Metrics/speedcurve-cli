module.exports = {
  env: {
    es6: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  plugins: [
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "@typescript-eslint/camelcase": false,
    "@typescript-eslint/explicit-function-return-type": false,
    "@typescript-eslint/explicit-member-accessibility": false,
    "prettier/prettier": "error",
  }
}
