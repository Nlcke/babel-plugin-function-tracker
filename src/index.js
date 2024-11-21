/**
 * @typedef Options
 * @prop {string} functionName name of imported function
 * @prop {string} moduleName name of module to import function from
 */

/**
 * Wraps statements in try/catch and wraps results in function calls.
 * @param {import('@babel/core').NodePath<import('@babel/types').CallExpression>} callExpressionPath
 * @param {import('@babel/core').NodePath<import('@babel/types').Statement>} statementPath
 * @param {import('@babel/core').NodePath<import('@babel/types').BlockStatement>} blockStatementPath
 * @param {import('@babel/types')} t
 * @returns {void}
 */
const handleBlock = (callExpressionPath, statementPath, blockStatementPath, t) => {
  const blockNode = blockStatementPath.node;
  const statementIndex = blockNode.body.indexOf(statementPath.node);
  const wrappedBlockStatement = t.blockStatement(blockNode.body.slice(statementIndex + 1));

  const endId = blockStatementPath.scope.generateUidIdentifier('end');
  const errorId = blockStatementPath.scope.generateUidIdentifier('e');

  blockNode.body = [
    ...blockNode.body.slice(0, statementIndex),
    t.variableDeclaration('const', [t.variableDeclarator(endId, callExpressionPath.node)]),
    t.tryStatement(
      wrappedBlockStatement,
      t.catchClause(
        errorId,
        t.blockStatement([t.throwStatement(t.callExpression(endId, [errorId]))]),
      ),
    ),
  ];

  blockStatementPath.traverse({
    ReturnStatement(returnPath) {
      if (returnPath.scope.getFunctionParent() === blockStatementPath.scope) {
        const isChildOfWrappedBlockStatement = !!returnPath.findParent(
          (path) => path.node === wrappedBlockStatement,
        );
        if (isChildOfWrappedBlockStatement) {
          const { node } = returnPath;
          node.argument = t.callExpression(endId, node.argument ? [node.argument] : []);
        }
      }
    },
  });

  const lastStatement = wrappedBlockStatement.body.at(-1);

  if (!lastStatement || lastStatement.type !== 'ReturnStatement') {
    wrappedBlockStatement.body.push(t.expressionStatement(t.callExpression(endId, [])));
  }
};

/**
 * Wraps statements after first call of specified imported function in try/catch and then wraps each
 * returned result inside that try/catch block in result of that call.
 * @param {import('@babel/core')} api
 * @param {Options} options
 * @returns {import('@babel/core').PluginObj}
 */
export default function plugin({ types: t }, options) {
  let hasBinding = false;

  return {
    name: 'babel-plugin-function-tracker',

    visitor: {
      ImportDeclaration(importDeclarationPath) {
        if (!hasBinding && importDeclarationPath.node.source.value === options.moduleName) {
          const binding = importDeclarationPath.scope.getBinding(options.functionName);
          if (binding) {
            hasBinding = true;
            const { referencePaths } = binding;
            for (let index = referencePaths.length - 1; index >= 0; index -= 1) {
              const referencePath = referencePaths[index];
              const callExpressionPath = referencePath.parentPath;
              if (callExpressionPath && callExpressionPath.isCallExpression()) {
                const statementPath = callExpressionPath.parentPath;
                if (statementPath.isStatement()) {
                  const blockStatementPath = statementPath.parentPath;
                  if (blockStatementPath.isBlockStatement()) {
                    handleBlock(callExpressionPath, statementPath, blockStatementPath, t);
                  }
                }
              }
            }
          }
        }
      },
    },
  };
}
