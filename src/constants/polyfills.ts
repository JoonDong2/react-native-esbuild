import esbuild, { type BuildOptions } from 'esbuild';
import { mergeConfig } from '../utils/config';

export const getJsPolyfills = async (options: BuildOptions = {}) => {
  return (
    await esbuild.build(
      mergeConfig(options, {
        outdir: 'node_modules/.cache/react-native-esbuild/',
        entryPoints: require('@react-native/js-polyfills')(),
        sourcemap: false,
        write: false,
        format: 'iife',
      })
    )
  ).outputFiles!.reduce((acc, cur) => {
    return acc + cur.text;
  }, '');
};
