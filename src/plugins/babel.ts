import { transformAsync } from '@babel/core';
import type { Loader } from 'esbuild';
import path from 'path';
import type { ChainingLoader, Filter } from './makePluginByChangingLoaders';

interface Props {
  babelConfig: any;
  include?: Filter[];
  exclude?: Filter[];
}

export const babelLoader = ({
  babelConfig,
  ...options
}: Props): ChainingLoader => {
  return {
    ...options,
    load: async (prevResult, originArgs) => {
      const { contents } = prevResult;
      if (!contents) return;

      const loader = path.extname(originArgs.path).slice(1) as Loader;
      const strContents =
        contents instanceof Uint8Array
          ? Buffer.from(contents).toString()
          : contents;

      const transformed = await transformAsync(strContents, {
        ...babelConfig,
        filename: originArgs.path,
        sourceMaps: false,
      });

      if (transformed === null) {
        throw new Error('babel failed !!');
      }

      const result = {
        contents: transformed.code ?? '',
        loader,
      };

      return result;
    },
  };
};
