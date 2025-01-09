import esbuild, { type BuildOptions } from 'esbuild';
import { mergeEsbuildConfig } from '../utils/config';
import { babel } from '../plugins/esbuild/babel';
import { getJsStyle } from './config';

export const getJsPolyfills = async (
  options: BuildOptions & { sourceRoot: string }
) => {
  return (
    await esbuild.build(
      mergeEsbuildConfig(options, getJsStyle(), {
        outdir: 'node_modules/.cache/react-native-esbuild/',
        entryPoints: require('@react-native/js-polyfills')(),
        sourcemap: false,
        write: false,
        format: 'iife',
        plugins: [
          babel({
            presets: ['module:@react-native/babel-preset'],
          }),
        ],
      })
    )
  ).outputFiles!.reduce((acc, cur) => {
    return acc + cur.text;
  }, '');
};
