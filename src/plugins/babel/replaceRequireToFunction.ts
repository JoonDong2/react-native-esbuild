import * as babelTypes from '@babel/types';
import { type PluginObj } from '@babel/core';
import { getAbsolutePath, removeLeadingSlash } from '../../utils/path';
import { getResolveExtensions } from '../../constants/config';

module.exports = function (platform: string) {
  const extensions = getResolveExtensions(platform);
  return function ({ types: t }: { types: typeof babelTypes }): PluginObj {
    return {
      visitor: {
        CallExpression(path, state) {
          const callee = path.get('callee');
          const args = path.get('arguments');
          // Check if it's a require() call
          if (
            callee.isIdentifier({ name: 'require' }) &&
            args.length === 1 &&
            args[0]?.isStringLiteral()
          ) {
            const requirePath = args[0].node.value;
            const transformedPath = removeLeadingSlash(
              getAbsolutePath({
                path: requirePath,
                basefile: state.filename,
                extensions,
              })
            );

            const newCallee = t.identifier(
              `require__${transformedPath.replace(/[/.@-]/g, '_').toLocaleLowerCase()}`
            );
            path.replaceWith(t.callExpression(newCallee, []));
          }
        },
      },
    };
  };
};
