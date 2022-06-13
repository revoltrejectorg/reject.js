module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "airbnb-base",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    quotes: ["error", "double"],
    "import/prefer-default-export": "off",
    "max-classes-per-file": "off",
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "class-methods-use-this": "off",
    "no-unused-vars": "off",
    "no-underscore-dangle": "off",
    "consistent-return": "off",
    "no-useless-return": "off",
    "no-empty-function": "off",
  },
  root: true,
};
