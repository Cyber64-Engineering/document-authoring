// eslint-disable-next-line func-names
module.exports = function () {
  return {
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source.value;
        if (source.endsWith('.jsx')) {
          path.node.source.value = source.replace(/\.jsx$/, '.js');
        }
      },
      CallExpression(path) {
        if (
          path.node.callee.type === 'Import'
          && path.node.arguments.length === 1
          && path.node.arguments[0].type === 'StringLiteral'
        ) {
          const importPath = path.node.arguments[0].value;
          if (importPath.endsWith('.jsx')) {
            path.node.arguments[0].value = importPath.replace(/\.jsx$/, '.js');
          }
        }
      },
      JSXAttribute(path) {
        if (path.node.name.name === 'className') {
          path.node.name.name = 'class';
        }
      },
      Program: {
        enter(path) {
          const hasHImport = path.node.body.some(
            (node) => node.type === 'ImportDeclaration'
              && node.source.value === 'dist/preact/index.js'
              && node.specifiers.some(
                (spec) => spec.imported && spec.imported.name === 'h',
              ),
          );
          if (!hasHImport) {
            path.node.body.unshift({
              type: 'ImportDeclaration',
              specifiers: [
                {
                  type: 'ImportSpecifier',
                  imported: { type: 'Identifier', name: 'h' },
                  local: { type: 'Identifier', name: 'h' },
                },
              ],
              source: {
                type: 'StringLiteral',
                value: 'dist/preact/index.js',
              },
            });
          }
        },
      },
    },
  };
};
