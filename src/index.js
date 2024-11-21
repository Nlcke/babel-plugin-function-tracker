/**
 * @typedef Options
 * @prop {string} functionName name of imported function
 * @prop {string} moduleName name of module to import function from
 */

/**
 * Checks for function name at import declaration.
 * @param {import('@babel/types').ImportDeclaration} importDeclaration
 * @param {Options} options
 * @returns {boolean}
 */
const getHasFunctionNameInImport = (importDeclaration, { functionName }) => {
  for (const specifier of importDeclaration.specifiers) {
    if (specifier.type === 'ImportSpecifier') {
      if (specifier.imported.type === 'StringLiteral') {
        if (specifier.imported.value === functionName) {
          return true;
        }
      } else if (
        specifier.imported.type === 'Identifier' &&
        specifier.imported.name === functionName
      ) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Returns index of statement with function name from options or -1 otherwise.
 * @param {import('@babel/types').Statement[]} statements
 * @param {Options} options
 * @returns {number}
 */
const findIndexOfStatement = (statements, { functionName }) => {
  for (let index = 0; index < statements.length; index += 1) {
    const statement = statements[index];
    if (statement.type === 'ExpressionStatement') {
      const { expression } = statement;
      if (expression.type === 'CallExpression') {
        const { callee } = expression;
        if (callee.type === 'Identifier') {
          if (callee.name === functionName) {
            return index;
          }
        }
      }
    }
  }
  return -1;
};

/**
 * Wraps statements in try/catch and wraps results in function calls.
 * @param {import('@babel/core').NodePath<import('@babel/types').Function>} funcPath
 * @param {Options} options
 * @param {import('@babel/types')} t
 * @returns {void}
 */
const handleFunctionPath = (funcPath, options, t) => {
  const blockStatement = funcPath.node.body;

  if (blockStatement.type !== 'BlockStatement') {
    return;
  }

  const statementIndex = findIndexOfStatement(blockStatement.body, options);

  if (statementIndex === -1) {
    return;
  }

  const statement = blockStatement.body[statementIndex];

  if (statement.type !== 'ExpressionStatement') {
    return;
  }

  const endId = funcPath.scope.generateUidIdentifier('end');

  blockStatement.body[statementIndex] = t.variableDeclaration('const', [
    t.variableDeclarator(endId, statement.expression),
  ]);

  const otherBlockStatement = t.blockStatement(blockStatement.body.slice(statementIndex + 1));

  const errorId = funcPath.scope.generateUidIdentifier('e');

  blockStatement.body = [
    ...blockStatement.body.slice(0, statementIndex + 1),
    t.tryStatement(
      otherBlockStatement,
      t.catchClause(
        errorId,
        t.blockStatement([t.throwStatement(t.callExpression(endId, [errorId]))]),
      ),
    ),
  ];

  funcPath.traverse({
    ReturnStatement(returnPath) {
      if (returnPath.scope.getFunctionParent() === funcPath.scope) {
        const isChildOfOtherBlockStatement = returnPath.findParent(
          (path) => path.node === otherBlockStatement,
        );
        if (isChildOfOtherBlockStatement) {
          const { node } = returnPath;
          node.argument = t.callExpression(endId, node.argument ? [node.argument] : []);
        }
      }
    },
  });

  const lastStatement = otherBlockStatement.body[otherBlockStatement.body.length - 1];

  if (lastStatement && lastStatement.type !== 'ReturnStatement') {
    otherBlockStatement.body.push(t.expressionStatement(t.callExpression(endId, [])));
  } else if (!lastStatement) {
    otherBlockStatement.body.push(t.expressionStatement(t.callExpression(endId, [])));
  }
};

/**
 * Wraps statements after first call of specified imported function in try/catch and then wraps each
 * returned result inside that try/catch block in result of that call.
 * @param {import('@babel/core')} api
 * @param {Options} options
 * @returns {import('@babel/core').PluginObj}
 */
const plugin = ({ types: t }, options) => ({
  name: 'babel-plugin-function-tracker',

  visitor: {
    Program(programPath) {
      const functionImport = programPath.node.body.find(
        (node) =>
          node.type === 'ImportDeclaration' &&
          node.source.value === options.moduleName &&
          getHasFunctionNameInImport(node, options),
      );

      if (functionImport) {
        programPath.traverse({
          Function(functionPath) {
            handleFunctionPath(functionPath, options, t);
          },
        });
      }
    },
  },
});

export default plugin;
