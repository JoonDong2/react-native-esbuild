import { type BundleArguments } from './types';
import { type Config } from '@react-native-community/cli-types';
import fs from 'fs';
import BundleService from '../utils/BuildContext';
import { getJsPolyfills } from '../constants/polyfills';
import { getDefine } from '../constants/config';
import { importVirtualModulesLoader } from '../plugins/esbuild/importVirtualModulesLoader';

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

  const polyfills = await getJsPolyfills({
    sourceRoot: root,
    define: getDefine(false),
    minify: true,
  });

  const buildContext = await BundleService.create({
    root,
    platform,
    minify,
    dev,
    sourcemap: true,
    write: true,
    outfile: bundleOutput,
    entryFile,
    header: polyfills,
    scriptLoaders: [
      importVirtualModulesLoader({
        modules: ['react-native/Libraries/Core/InitializeCore'],
        applyIds: [entryFile],
      }),
    ],
  });

  await buildContext.build();
  buildContext.dispose();

  // move sourcemap
  if (sourcemapOutput) {
    const originSourceMap = `${bundleOutput}.map`;
    fs.copyFileSync(originSourceMap, sourcemapOutput);
    fs.unlink(originSourceMap, () => {});
  }
}
