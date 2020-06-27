module.exports = {
  env: {
    browser: true,
  },
  rules: {
    '@typescript-eslint/no-inferrable-types': 1,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
  },
  extends: ['@siroc'],
}
