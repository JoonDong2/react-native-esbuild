import type { Loader } from 'esbuild';
import path from 'path';
import type { ChainingLoader } from './makePluginProviderByChangingLoaders';

interface Props {
  modules: string[];
  applyIds: string[];
}

const allowedExts = ['js', 'ts', 'jsx', 'tsx'];

export const importVirtualModulesLoader = ({
  modules,
  applyIds,
}: Props): ChainingLoader => {
  if (applyIds.some((id) => !allowedExts.includes(path.extname(id).slice(1)))) {
    throw new Error('wrong extension !!');
  }

  return {
    include: applyIds,
    load(prevResult, onriginArgs) {
      if (!prevResult.contents) {
        throw new Error('wrong entry !!');
      }

      const { contents } = prevResult;
      const strContents =
        contents instanceof Uint8Array
          ? Buffer.from(contents).toString()
          : contents;

      return {
        contents: `${modules.map((mod) => `import "${mod}";`).join('\n')}\n${strContents}`,
        loader: path.extname(onriginArgs.path).slice(1) as Loader,
      };
    },
  };
};
