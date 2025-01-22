const workspace = require('./src/esbuild/plugins/workspace');

module.exports = (exposedBuildInfo) => {
  if (exposedBuildInfo?.purpose !== 'start') {
    return null;
  }

  return {
    plugins: [workspace()],
  };
};
