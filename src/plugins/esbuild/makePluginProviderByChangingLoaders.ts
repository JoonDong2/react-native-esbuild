import type { OnLoadArgs, OnLoadResult, Plugin } from 'esbuild';
import fs from 'fs';
import { mergeFilters } from '../../utils/regexp';

const defaultPreProcess = async (args: OnLoadArgs) => {
  const { path } = args;
  const contents = await fs.promises.readFile(path);
  return {
    contents,
    ...args,
  };
};

interface Config {
  name: string;
  useCache?: boolean;
  filter?: RegExp; // 플러그인 전체 필터, 필터링되면 차단
  preprocess?: (args: OnLoadArgs) => OnLoadResult | Promise<OnLoadResult>;
}

export type Filter = string | RegExp;

export interface ChainingLoader {
  // 필터링되면 다음 플러그인에 위임
  include?: Filter[];
  exclude?: Filter[];
  // undefined 반환하면 다음 플러그인에 위임
  load: (
    prevResult: OnLoadResult,
    onriginArgs: OnLoadArgs
  ) => OnLoadResult | undefined | Promise<OnLoadResult | undefined>;
}

type WithMergedRegExp<T> = T & {
  includeRegExp?: RegExp;
  excludeRegExp?: RegExp;
};

export const makePluginProviderByChangingLoaders = (
  config: Config,
  loaders: ChainingLoader[]
): {
  plugin: Plugin;
  resetCache: () => void;
  deleteCache: (path: string) => void;
} => {
  const { name, filter, useCache, preprocess = defaultPreProcess } = config;

  const cache = new Map<string, OnLoadResult>();

  const loadersWithRegExp = loaders.map<WithMergedRegExp<ChainingLoader>>(
    (loader) => {
      return {
        ...loader,
        includeRegExp: mergeFilters(loader.include),
        excludeRegExp: mergeFilters(loader.exclude),
      };
    }
  );

  return {
    deleteCache(path) {
      cache.delete(path);
    },
    resetCache() {
      cache.clear();
    },
    plugin: {
      name,
      setup(build) {
        build.onLoad({ filter: filter || /\.*/ }, async (args) => {
          if (useCache) {
            const cached = cache.get(args.path);
            if (cached) {
              return cached;
            }
          }

          let result: OnLoadResult = await preprocess(args);
          for (const loader of loadersWithRegExp) {
            const { includeRegExp, excludeRegExp } = loader;
            if (
              (includeRegExp && !includeRegExp.test(args.path)) ||
              (!includeRegExp && excludeRegExp && excludeRegExp.test(args.path))
            ) {
              continue;
            }
            const newResult = await loader.load(result, args);
            if (newResult) {
              result = newResult;
            }
          }

          if (useCache) {
            cache.set(args.path, result);
          }

          return result;
        });
      },
    },
  };
};
