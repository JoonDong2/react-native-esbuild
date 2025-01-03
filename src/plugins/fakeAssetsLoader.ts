import type { Plugin } from 'esbuild';

// TODO: AssetRegistry에 넣고, id로 변경하는 코드로 변환
export const fakeAssetsLoader = (): Plugin => {
  return {
    name: 'fake-assets-loader',
    setup(build) {
      build.onLoad({ filter: /\.(png|jpg|gif)/ }, () => {
        return {
          contents: `{}`,
          loader: 'js',
        };
      });
    },
  };
};
