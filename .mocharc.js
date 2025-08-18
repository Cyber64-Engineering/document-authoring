export default {
  require: ['@babel/register', './test/setup.js'],
  extension: ['js'],
  spec: 'blocks/**/tests/*.test.js',
  recursive: true,
};
