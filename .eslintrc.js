/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['airbnb', 'prettier'],
  rules: {
    'no-restricted-syntax': 'off',
  },
};
