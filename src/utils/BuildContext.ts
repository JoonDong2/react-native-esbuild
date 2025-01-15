import type {
  BuildContext as BuildContextType,
  BuildResult,
  Plugin,
} from 'esbuild';
import { validatePlatform, type Platform } from '../constants/platform';
import esbuild from 'esbuild';
import {
  getConditionNames,
  getDefine,
  getJsStyle,
  getMainFields,
  getResolveExtensions,
  getUserBabelConfig,
  getUserEsbuildConfig,
  makeScriptPlugin,
} from '../constants/config';
import { babelLoader } from '../plugins/esbuild/babel';
import { mergeConfig, mergeEsbuildConfig } from './config';
import { fakeAssetsLoader } from '../plugins/esbuild/fakeAssetsLoader';
import type { ChainingLoader } from '../plugins/esbuild/makePluginByChangingLoaders';

interface Props {
  root: string;
  platform: string;
  minify?: boolean;
  dev?: boolean;
  entryFile: string;
  write?: boolean;
  outfile?: string;
  sourcemap?: boolean | 'linked' | 'inline' | 'external' | 'both';
  scriptLoaders?: ChainingLoader[];
  plugins?: Plugin[];
  header?: string;
  footer?: string;
  bundle?: boolean;
}

class BuildContext {
  private platform: Platform;
  private context: BuildContextType;
  cancel: () => Promise<void>;
  dispose: () => Promise<void>;
  last?: BuildResult;

  resolvedPaths: Set<string> = new Set();

  pushPath(absPath: string) {
    this.resolvedPaths.add(absPath);
  }

  isResolved(absPath: string) {
    return this.resolvedPaths.has(absPath);
  }

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
    entryFile,
    sourcemap,
    write = true,
    outfile,
    minify = true,
    scriptLoaders = [],
    plugins = [],
    header,
    footer,
    bundle = true,
  }: Props) {
    if (!validatePlatform(platformFromProps)) {
      throw new Error('invalid platform !!');
    }

    const platform = platformFromProps as Platform;

    const userEsbuildConfig = getUserEsbuildConfig(root);
    const userBabelConfig = getUserBabelConfig(root);
    const define = getDefine(dev);
    const resolveExtensions = getResolveExtensions(platform);

    const mergedBabelConfig = mergeConfig(
      userBabelConfig,
      dev
        ? {
            plugins: [require('react-refresh/babel')],
          }
        : {}
    );

    const scriptPlugin = makeScriptPlugin(
      babelLoader({
        babelConfig: mergedBabelConfig,
      }),
      ...scriptLoaders
    );

    const defaultBuildOptions = mergeEsbuildConfig(
      {
        sourceRoot: root,
        define,
        bundle,
        minify,
        resolveExtensions,
        plugins: [scriptPlugin, ...plugins],
        sourcemap,
      },
      getJsStyle(),
      // Since the onResolve plugin for HMR needs to take priority, its precedence is deferred (User-defined settings should probably take precedence?
      userEsbuildConfig
    );

    if (write && !outfile) {
      throw new Error('no outfile !!');
    }

    const mergedConfig = mergeEsbuildConfig(defaultBuildOptions, {
      entryPoints: [entryFile],
      outfile:
        write && outfile
          ? outfile
          : './node_modules/.cache/react-native-esbuild',
      // TODO: batter position ??
      banner: {
        js: header ?? '',
      },
      footer: {
        js: footer ?? '',
      },
      write,
      metafile: true,
      mainFields: getMainFields(),
      plugins: [fakeAssetsLoader()],
      conditions: getConditionNames(),
    });

    return new BuildContext(platform, await esbuild.context(mergedConfig));
  }

  async build() {
    const start = Date.now();
    console.info('bundling for', this.platform);
    const result = await this.context.rebuild();
    console.info(`bundled ! ${Date.now() - start}ms`);
    this.last = result;
    return result;
  }
}

export default BuildContext;
