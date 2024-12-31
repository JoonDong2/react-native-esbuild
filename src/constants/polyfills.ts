import esbuild, { type BuildOptions } from 'esbuild';
import { mergeConfig } from 'vite';

export const getJsPolyfills = async (options: BuildOptions = {}) => {
  return (
    await esbuild.build(
      mergeConfig<BuildOptions, BuildOptions>(options, {
        outdir: 'node_modules/.cache/react-native-esbuild/',
        entryPoints: require('@react-native/js-polyfills')(),
        sourcemap: false,
        write: false,
      }) as BuildOptions
    )
  ).outputFiles!.reduce((acc, cur) => {
    return acc + cur.text;
  }, '');
};
