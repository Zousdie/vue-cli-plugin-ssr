module.exports = {
  root: true,

  extends: ['airbnb-base'],

  env: {
    node: true,
  },

  globals: {
    name: 'off',
  },

  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    'linebreak-style': ['error', 'unix'],
    'no-param-reassign': 'off',
    'func-names': 'off',
    'no-underscore-dangle': 'off',
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-unresolved': 'off'
  }
};
