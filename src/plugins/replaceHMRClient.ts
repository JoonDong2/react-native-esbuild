import type { Plugin } from 'esbuild';

const replaceHMRClient = (): Plugin => {
  return {
    name: 'replace-hmr-client',
    setup(build) {
      build.onResolve({ filter: /HMRClient$/ }, () => {
        return {
          path: require.resolve('../hmr/HMRClient'),
        };
      });
    },
  };
};

export default replaceHMRClient;
