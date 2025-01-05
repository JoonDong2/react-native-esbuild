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

        if (args.path === 'react-native' || args.path === 'react') {
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
