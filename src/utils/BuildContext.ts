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
import _ from 'lodash';
import { metroResolve } from './metroResolve';

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
  purpose?: 'bundle' | 'start' | 'hmr';
}

const exposedBuildProps = [
  'root',
  'platform',
  'dev',
  'minify',
  'entryFile',
  'bundle',
  'purpose',
] as const;

export type ExposedBuildInfo = Pick<Props, (typeof exposedBuildProps)[number]>;

const extractExtractExposedBuildInfo = (props: Props): ExposedBuildInfo => {
  return _.pick(props, exposedBuildProps);
};

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

  static async create(props: Props) {
    const {
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
    } = props;

    if (!validatePlatform(platformFromProps)) {
      throw new Error('invalid platform !!');
    }

    const platform = platformFromProps as Platform;

    const exposedBuildInfo = extractExtractExposedBuildInfo(props);

    const userEsbuildConfig = getUserEsbuildConfig(root, exposedBuildInfo);
    const userBabelConfig = getUserBabelConfig(root, exposedBuildInfo);
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
      userEsbuildConfig,
      {
        sourceRoot: root,
        define,
        bundle,
        minify,
        resolveExtensions,
        plugins: [
          ...plugins,
          scriptPlugin,
          {
            name: 'resolve',
            setup(build) {
              build.onResolve({ filter: /.*/ }, (args) => {
                return {
                  path: metroResolve({
                    dev,
                    path: args.path,
                    basefile: args.importer,
                    extensions: resolveExtensions.map((ext) => ext.slice(1)),
                    mainFields: getMainFields(),
                    platform,
                    root,
                  }),
                };
              });
            },
          },
        ],
        sourcemap,
      },
      getJsStyle()
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
