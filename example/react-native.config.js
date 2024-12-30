const path = require('path');
const pkg = require('../package.json');
const { createRequire } = require('module');

const esbuildRequire = createRequire(require.resolve('..'));
const commands = esbuildRequire('react-native-esbuild/commands');

module.exports = {
  project: {
    ios: {
      automaticPodsInstallation: true,
    },
  },
  dependencies: {
    [pkg.name]: {
      root: path.join(__dirname, '..'),
    },
  },
  commands,
};
