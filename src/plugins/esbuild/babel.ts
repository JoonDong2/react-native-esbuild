import { transformAsync } from '@babel/core';
import type { Loader, Plugin } from 'esbuild';
import path from 'path';
import type { ChainingLoader, Filter } from './makePluginByChangingLoaders';
import fs from 'fs';

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

export const babel = (babelConfig: any): Plugin => {
  return {
    name: 'esbuild-babel',
    setup(build) {
      build.onLoad({ filter: /.*/ }, async (args) => {
        const loader = path.extname(args.path).slice(1) as Loader;
        const contents = Buffer.from(
          await fs.promises.readFile(args.path)
        ).toString();

        const transformed = await transformAsync(contents, {
          ...babelConfig,
          filename: args.path,
          sourceMaps: false,
        });

        if (transformed === null || !transformed.code) {
          throw new Error('babel failed !!');
        }

        return {
          contents: transformed.code,
          loader,
        };
      });
    },
  };
};
