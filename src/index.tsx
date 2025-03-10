import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-esbuild' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const EsbuildModule = isTurboModuleEnabled
  ? require('./NativeEsbuild').default
  : NativeModules.Esbuild;

const Esbuild = EsbuildModule
  ? EsbuildModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function evaluateJavascript(code: string): Promise<number> {
  return Esbuild.evaluateJavascript(code);
}

export { type ExposedBuildInfo } from './utils/BuildContext';
