import * as babelTypes from '@babel/types';
import { type PluginObj } from '@babel/core';
import { removeLeadingSlash } from '../../utils/path';
import { metroResolve } from '../../utils/metroResolve';

interface Props {
  mainFields: string[];
  platform: string;
  root: string;
  dev: boolean;
  extensions: string[];
}

module.exports = function (props: Props) {
  const { mainFields, platform, root, dev, extensions } = props;
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
              metroResolve({
                path: requirePath,
                basefile: state.filename!,
                extensions,
                platform,
                mainFields,
                root,
                dev,
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
