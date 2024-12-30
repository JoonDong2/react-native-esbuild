import { createServer } from 'vite';
import { type Config } from '@react-native-community/cli-types';
import { type StartArguments } from './types';

export async function start(_: string[], config: Config, __: StartArguments) {
  const { root } = config;

  const define = {
    '__DEV__': 'true',
    'window': 'globalThis', // JSC와 hermes에 정의 안되어 있다.
    'global': 'globalThis', // JSC와 hermes에 정의 안되어 있다.
    'process.env.NODE_ENV': `"development"`,
  };

  const server = await createServer({
    define,
    server: {
      hmr: {
        port: 8081,
      },
      watch: {
        cwd: root,
      },
    },
    plugins: [],
  });

  await server.listen();

  return {
    stop: () => {
      server.close();
    },
  };
}
