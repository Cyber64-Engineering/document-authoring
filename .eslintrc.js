module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
  },
  // Required for preact utilities
  globals: {
    h: 'readonly',
    useState: 'readonly',
    useEffect: 'readonly',
    useRef: 'readonly',
    useCallback: 'readonly',
    useMemo: 'readonly',
    useReducer: 'readonly',
    useLayoutEffect: 'readonly',
    module: 'readonly',
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
    'import/no-cycle': 0, // Allow modules to use each other
    'import/no-unresolved': 'off',
    'no-console': ['error', { allow: ['error'] }],
    'no-unused-vars': 'warn',
  },
};
