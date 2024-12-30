import { type BundleArguments } from './types';
import { type Config } from '@react-native-community/cli-types';
import { mergeConfig } from 'vite';
import fs from 'fs';
import esbuild, { type BuildOptions } from 'esbuild';
import { babelLoader } from '../plugins/esbuild/babel';
import { makePluginProviderByChangingLoaders } from '../plugins/esbuild/makePluginProviderByChangingLoaders';
import { importVirtualModulesLoader } from '../plugins/esbuild/importVirtualModulesLoader';
import { getConfig } from '../utils/config';

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
  const define = {
    '__DEV__': dev ? 'true' : 'false',
    'window': 'globalThis', // JSC와 hermes에 정의되어 있지 않다.
    'global': 'globalThis', // JSC와 hermes에 정의되어 있지 않다.
    'process.env.NODE_ENV': dev ? `"development"` : `"production"`,
  };

  const esbuildConfig = getConfig(`${root}/esbuild.config.js`);
  const babelConfig = getConfig(`${root}/babel.config.js`);

  const pluginProvider = makePluginProviderByChangingLoaders(
    {
      name: 'for-react-native',
      filter: /\.(js|jsx|ts|tsx)$/,
    },
    [
      importVirtualModulesLoader({
        modules: ['react-native/Libraries/Core/InitializeCore'],
        applyIds: [entryFile],
      }),
      babelLoader({ babelConfig }),
    ]
  );

  const defaultBuildOptions: BuildOptions = mergeConfig<
    BuildOptions,
    BuildOptions
  >(esbuildConfig, {
    sourceRoot: root,
    define,
    bundle: true,
    format: 'cjs',
    target: 'es2015',
    minify,
    resolveExtensions: [
      `.${platform}.js`,
      '.native.js',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
    ],
    plugins: [pluginProvider.plugin],
  });

  const jsPolyfills = (
    await esbuild.build(
      mergeConfig<BuildOptions, BuildOptions>(defaultBuildOptions, {
        outdir: 'node_modules/.cache/react-native-esbuild/',
        entryPoints: require('@react-native/js-polyfills')(),
        sourcemap: false,
        write: false,
      }) as BuildOptions
    )
  ).outputFiles!.reduce((acc, cur) => {
    return acc + cur.text;
  }, '');

  const mergedConfig = mergeConfig<BuildOptions, BuildOptions>(
    defaultBuildOptions,
    {
      entryPoints: [entryFile],
      outfile: bundleOutput,
      sourcemap: true,
      // TODO: where ??
      banner: {
        js: jsPolyfills, // TODO: hmr client 추가
      },
      write: true,
      plugins: [
        // TODO: AssetRegistry에 넣고, id로 변경하는 코드로 변환
        {
          name: 'fake-assets-loader',
          setup(build) {
            build.onLoad({ filter: /\.(png|jpg|gif)/ }, () => {
              return {
                contents: `{}`,
                loader: 'js',
              };
            });
          },
        },
      ],
    }
  ) as BuildOptions;

  await esbuild.build(mergedConfig);

  // move sourcemap
  if (sourcemapOutput) {
    const originSourceMap = `${bundleOutput}.map`;
    fs.copyFileSync(originSourceMap, sourcemapOutput);
    fs.unlink(originSourceMap, () => {});
  }
}
