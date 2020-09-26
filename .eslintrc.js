module.exports = {
  env: {
    browser: true,
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-inferrable-types': 1,
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-vars': 'off',
  },
  extends: ['@siroc'],
}
