module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react'],
  env: {
    browser: true,
    es2021: true,
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
  globals: {
    window: 'readonly',
    document: 'readonly',
    console: 'readonly',
    navigator: 'readonly',
  },
};
