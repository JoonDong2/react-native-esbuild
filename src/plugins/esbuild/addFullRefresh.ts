import dedent from 'dedent';
import type { ChainingLoader } from './makePluginByChangingLoaders';
import path from 'path';
import type { Loader } from 'esbuild';

export default (
  filter: (path: string, contents?: string) => boolean
): ChainingLoader => {
  return {
    load(prevResult, originArgs) {
      const loader = path.extname(originArgs.path).slice(1) as Loader;
      const contents =
        prevResult.contents instanceof Uint8Array
          ? Buffer.from(prevResult.contents).toString()
          : prevResult.contents;

      if (!filter(originArgs.path, contents)) {
        return;
      }

      return {
        contents:
          contents +
          dedent`
          var { DevSettings } = require("react-native");
          DevSettings.reload();
          `,
        loader,
      };
    },
  };
};
