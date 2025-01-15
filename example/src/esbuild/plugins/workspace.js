const path = require('path');

const workspace = () => {
  return {
    name: 'resolve-workspaces',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.path === 'react-native-esbuild') {
          return {
            path: require.resolve(path.join(__dirname, '../../../../')),
          };
        }

        if (
          args.path === 'react' ||
          args.path === 'react-native' ||
          args.path === '@react-native' ||
          args.path.startsWith('react-refresh') ||
          args.path.startsWith('@babel/runtime')
        ) {
          const nodeModules = path.resolve(__dirname, '../../../node_modules');

          return {
            path: require.resolve(args.path, {
              paths: [nodeModules],
            }),
          };
        }
      });
    },
  };
};

module.exports = workspace;
