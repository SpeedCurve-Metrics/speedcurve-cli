module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    "plugin:prettier/recommended"
  ],
  plugins: [
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "prettier/prettier": "error",
  }
}
