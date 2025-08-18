const path = require('path');

module.exports = {
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'h',
        pragmaFrag: 'Fragment',
      },
    ],
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@preact': './dist/preact/index.js',
        },
      },
    ],
    path.resolve(__dirname, 'babel-plugin-preact-jsx-import-fix'),
  ],
};
