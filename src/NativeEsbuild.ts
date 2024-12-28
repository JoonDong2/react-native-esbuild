import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  evaluateJavascript(code: string): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Esbuild');
