import type {
  BuildContext as BuildContextType,
  BuildResult,
  Plugin,
} from 'esbuild';
import { validatePlatform, type Platform } from '../constants/platform';
import esbuild from 'esbuild';
import {
  getDefine,
  getJsStyle,
  getResolveExtensions,
  getUserBabelConfig,
  getUserEsbuildConfig,
  makeScriptPlugin,
} from '../constants/config';
import { importVirtualModulesLoader } from '../plugins/importVirtualModulesLoader';
import { babelLoader } from '../plugins/babel';
import { mergeConfig } from './config';
import { getJsPolyfills } from '../constants/polyfills';
import { fakeAssetsLoader } from '../plugins/fakeAssetsLoader';
import path from 'path';
import type { ChainingLoader } from '../plugins/makePluginByChangingLoaders';

interface Props {
  root: string;
  platform: string;
  minify?: boolean;
  dev?: boolean;
  entryFile?: string;
  write?: boolean;
  outfile?: string;
  sourcemap?: boolean | 'linked' | 'inline' | 'external' | 'both';
  scriptLoaders?: ChainingLoader[];
  plugins?: Plugin[];
}

class BuildContext {
  private platform: Platform;
  private context: BuildContextType;
  cancel: () => Promise<void>;
  dispose: () => Promise<void>;
  last?: BuildResult;

  private constructor(platform: Platform, context: BuildContextType) {
    this.platform = platform;
    this.context = context;
    this.cancel = context.cancel;
    this.dispose = context.dispose;
  }

  static async create({
    root,
    dev = true,
    platform: platformFromProps,
    entryFile: entryFileFromProps,
    sourcemap,
    write = true,
    outfile,
    minify = true,
    scriptLoaders = [],
    plugins = [],
  }: Props) {
    if (!validatePlatform(platformFromProps)) {
      throw new Error('invalid platform !!');
    }

    const platform = platformFromProps as Platform;

    const userEsbuildConfig = getUserEsbuildConfig(root);
    const userBabelConfig = getUserBabelConfig(root);
    const define = getDefine(dev);
    const resolveExtensions = getResolveExtensions(platform);

    let entryFile = entryFileFromProps;
    if (!entryFile) {
      for (const extension of resolveExtensions) {
        try {
          entryFile = require.resolve(path.join(root, `index${extension}`));
          break;
        } catch {}
      }

      if (!entryFile) {
        throw new Error('no entry file !!');
      }
    }

    const scriptPlugin = makeScriptPlugin(
      importVirtualModulesLoader({
        modules: ['react-native/Libraries/Core/InitializeCore'],
        applyIds: [entryFile],
      }),
      babelLoader({ babelConfig: userBabelConfig }),
      ...scriptLoaders
    );

    const defaultBuildOptions = mergeConfig(
      userEsbuildConfig,
      {
        sourceRoot: root,
        define,
        bundle: true,
        minify,
        resolveExtensions,
        plugins: [scriptPlugin, ...plugins],
        sourcemap,
      },
      getJsStyle()
    );

    const jsPolyfills = await getJsPolyfills(defaultBuildOptions);

    if (write && !outfile) {
      throw new Error('no outfile !!');
    }

    const mergedConfig = mergeConfig(defaultBuildOptions, {
      entryPoints: [entryFile],
      outfile:
        write && outfile
          ? outfile
          : './node_modules/.cache/react-native-esbuild',
      // TODO: batter position ??
      banner: {
        js: jsPolyfills,
      },
      write,
      metafile: true,
      plugins: [fakeAssetsLoader()],
    });

    return new BuildContext(platform, await esbuild.context(mergedConfig));
  }

  async build() {
    console.info('bundling for', this.platform);
    const result = await this.context.rebuild();
    console.info('bundled !');
    this.last = result;
    return result;
  }
}

export default BuildContext;
