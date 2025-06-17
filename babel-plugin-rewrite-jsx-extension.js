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
        // For dynamic import('./MyComponent.jsx')
        if (
          path.node.callee.type === 'Import' &&
          path.node.arguments.length === 1 &&
          path.node.arguments[0].type === 'StringLiteral'
        ) {
          const importPath = path.node.arguments[0].value;
          if (importPath.endsWith('.jsx')) {
            path.node.arguments[0].value = importPath.replace(/\.jsx$/, '.js');
          }
        }
      },
    },
  };
};
