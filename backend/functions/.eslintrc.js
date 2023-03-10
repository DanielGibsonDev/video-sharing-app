module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'google'],
  rules: {
    'max-len': ['error', { code: 120 }],
    'object-curly-spacing': 0,
  },
  parserOptions: {
    // Required for certain syntax usages
    ecmaVersion: 2020,
  },
};
