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
    path.resolve(__dirname, 'babel-plugin-rewrite-jsx-extension'),
  ],
};
