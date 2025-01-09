import { type Config } from '@react-native-community/cli-types';
import {
  type BundleQuery,
  type ParsedRequestListener,
  type StartArguments,
} from './types';

import BuildContext from '../utils/BuildContext';
import configureHMR from '../hmr/configureHMR';
import replaceHMRClient from '../plugins/esbuild/replaceHMRClient';

import { createServer } from 'http';
import { importVirtualModulesLoader } from '../plugins/esbuild/importVirtualModulesLoader';
import { getDefine, getResolveExtensions } from '../constants/config';
import { sync as resolveSync } from 'resolve';
import path from 'path';
import { getJsPolyfills } from '../constants/polyfills';

export async function start(_: string[], config: Config, args: StartArguments) {
  const { root } = config;
  const { host = '127.0.0.1', port = 8081 } = args;

  const buildContextOf: {
    [key: string]: BuildContext;
  } = {};

  const routes = new Map<string, ParsedRequestListener>();

  const server = createServer((req, res) => {
    const { url, method } = req;
    const parsedUrl = new URL(url || '', 'http://localhost');
    const path = parsedUrl.pathname;
    const listener = routes.get(path);
    return listener?.(
      Object.assign(req, {
        path: path,
        query: Object.fromEntries(parsedUrl.searchParams.entries()),
        method: method?.toLowerCase() ?? 'get',
      }),
      res
    );
  });

  routes.set('/status', (_, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('packager-status:running');
  });

  const polyfillsPromise = getJsPolyfills({
    sourceRoot: root,
    define: getDefine(true),
    minify: false,
  });

  routes.set('/index.bundle', async (req, res) => {
    const { platform, dev, minify } = req.query as unknown as BundleQuery;

    if (!platform) return;

    let buildContext = buildContextOf[platform];
    if (!buildContext) {
      const extensions = getResolveExtensions(platform);
      const entryFile = resolveSync(path.join(root, 'index'), {
        basedir: root,
        extensions,
      });

      const polyfills = await polyfillsPromise;

      buildContext = await BuildContext.create({
        root,
        entryFile,
        platform,
        dev: dev === 'true',
        minify: minify === 'true',
        write: false,
        sourcemap: 'inline',
        header: polyfills,
        plugins: [replaceHMRClient()],
        scriptLoaders: [
          importVirtualModulesLoader({
            modules: ['react-native/Libraries/Core/InitializeCore'],
            applyIds: [entryFile],
          }),
        ],
      });
      buildContextOf[platform] = buildContext;
    }

    const result = await buildContext.build();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(result.outputFiles?.[0]?.text);
  });

  routes.set('/hot', configureHMR(root, server, buildContextOf));

  server.listen(port, host, () => {
    console.log(`Dev server running on ${host}:${port}`);
  });

  return {
    stop: () => {
      server.close();
      Object.keys(buildContextOf).forEach((platform) => {
        buildContextOf[platform]?.dispose();
      });
    },
  };
}
