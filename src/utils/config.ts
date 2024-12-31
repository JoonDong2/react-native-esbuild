import type { BuildOptions } from 'esbuild';
import { mergeConfig as mergeConfigOrigin } from 'vite';

export const getConfig = (path: string) => {
  try {
    return require(path);
  } catch (e) {
    return {};
  }
};

export const mergeConfig = (...configs: BuildOptions[]): BuildOptions => {
  if (!Array.isArray(configs) || configs.length === 0) {
    throw new Error('empty configs !!');
  }

  if (configs.length === 1) {
    return configs[0]!;
  }

  const first = configs[0]!;
  const remains = configs.slice(1)!;

  return remains.reduce<BuildOptions>((acc, cur) => {
    return mergeConfigOrigin<BuildOptions, BuildOptions>(acc, cur);
  }, first);
};
