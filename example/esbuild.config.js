const workspace = require('./src/esbuild/plugins/workspace');

module.exports = {
  plugins: [workspace()],
};
