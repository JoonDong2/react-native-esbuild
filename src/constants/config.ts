import type { BuildOptions } from 'esbuild';
import {
  makePluginByChangingLoaders,
  type ChainingLoader,
} from '../plugins/esbuild/makePluginByChangingLoaders';
import { getConfig } from '../utils/config';
import type { ExposedBuildInfo } from '../utils/BuildContext';

export const getDefine = (dev: boolean) => {
  return {
    '__DEV__': dev ? 'true' : 'false',
    'window': 'globalThis', // This is not defined in JSC and Hermes.
    'global': 'globalThis', // This is not defined in JSC and Hermes.
    'process.env.NODE_ENV': dev ? `"development"` : `"production"`,
  };
};

export const getResolveExtensions = (platform: string) => {
  return [`.${platform}.js`, '.native.js', '.js', '.jsx', '.ts', '.tsx'];
};

export const makeScriptPlugin = (
  ...chaingingLoaders: (ChainingLoader | undefined | null)[]
) => {
  return makePluginByChangingLoaders(
    {
      name: 'script-plugin',
      filter: /\.(js|jsx|ts|tsx)$/,
    },
    [...chaingingLoaders]
  );
};

const injectDataToConfig = (config?: Function | Object, data?: any) => {
  if (typeof config === 'function' && data) {
    return config(data);
  }
  return config;
};

export const getUserEsbuildConfig = (
  root: string,
  exposedBuildInfo?: ExposedBuildInfo
) => {
  const config = getConfig(`${root}/esbuild.config.js`);
  return injectDataToConfig(config, exposedBuildInfo);
};

export const getUserBabelConfig = (
  root: string,
  exposedBuildInfo?: ExposedBuildInfo
) => {
  const config = getConfig(`${root}/babel.config.js`);
  return injectDataToConfig(config, exposedBuildInfo);
};

export const getJsStyle = (): BuildOptions => {
  return {
    format: 'cjs',
    target: 'es2015',
  };
};

// https://github.com/facebook/metro/blob/main/docs/Configuration.md#resolvermainfields
export const getMainFields = () => {
  return ['react-native', 'browser', 'main'];
};

// https://esbuild.github.io/api/#how-conditions-work
// https://github.com/facebook/react-native/blob/main/packages/metro-config/src/index.flow.js#L57
export const getConditionNames = () => {
  return ['default', 'require', 'import', 'react-native'];
};
