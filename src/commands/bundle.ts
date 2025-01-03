import { type BundleArguments } from './types';
import { type Config } from '@react-native-community/cli-types';
import fs from 'fs';
import esbuild from 'esbuild';
import {
  makeScriptPlugin,
  getDefine,
  getJsStyle,
  getResolveExtensions,
  getUserBabelConfig,
  getUserEsbuildConfig,
} from '../constants/config';
import { getJsPolyfills } from '../constants/polyfills';
import { mergeConfig } from '../utils/config';
import { fakeAssetsLoader } from '../plugins/fakeAssetsLoader';
import { importVirtualModulesLoader } from '../plugins/importVirtualModulesLoader';
import { babelLoader } from '../plugins/babel';

export async function bundle(
  _: string[],
  config: Config,
  args: BundleArguments
) {
  const { root } = config;
  const {
    bundleOutput,
    platform,
    dev: devString,
    minify,
    sourcemapOutput,
    entryFile,
  } = args;
  const dev = JSON.parse(devString);
  const define = getDefine(dev);
  const resolveExtensions = getResolveExtensions(platform);

  const userEsbuildConfig = getUserEsbuildConfig(root);
  const userBabelConfig = getUserBabelConfig(root);

  const scriptPlugin = makeScriptPlugin(
    importVirtualModulesLoader({
      modules: ['react-native/Libraries/Core/InitializeCore'],
      applyIds: [entryFile],
    }),
    babelLoader({ babelConfig: userBabelConfig })
  );

  const defaultBuildOptions = mergeConfig(
    userEsbuildConfig,
    {
      sourceRoot: root,
      define,
      bundle: true,
      minify,
      resolveExtensions,
      plugins: [scriptPlugin],
    },
    getJsStyle()
  );

  const jsPolyfills = await getJsPolyfills(defaultBuildOptions);

  const mergedConfig = mergeConfig(defaultBuildOptions, {
    entryPoints: [entryFile],
    outfile: bundleOutput,
    sourcemap: true,
    // TODO: batter position ??
    banner: {
      js: jsPolyfills,
    },
    write: true,
    plugins: [fakeAssetsLoader()],
  });

  await esbuild.build(mergedConfig);

  // move sourcemap
  if (sourcemapOutput) {
    const originSourceMap = `${bundleOutput}.map`;
    fs.copyFileSync(originSourceMap, sourcemapOutput);
    fs.unlink(originSourceMap, () => {});
  }
}
