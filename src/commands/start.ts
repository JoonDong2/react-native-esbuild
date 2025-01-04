import { type Config } from '@react-native-community/cli-types';
import { type StartArguments } from './types';

import express from 'express';
import BuildContext from '../utils/BuildContext';
import { type Platform } from '../constants/platform';

interface BundleQuery {
  platform: Platform;
  dev: 'true' | 'false';
  minify: 'true' | 'false';
  // not used
  lazy: 'true' | 'false';
  app: string;
  modulesOnly: 'true' | 'false';
  runModule: 'true' | 'false';
  excludeSource: 'true' | 'false';
  sourcePaths: 'url-server' | 'absolute';
}

export async function start(_: string[], config: Config, args: StartArguments) {
  const { root } = config;
  const { host = '127.0.0.1', port = 8081 } = args;

  const devServer = express();

  devServer.get('/status', (_, res) => {
    res.status(200).send('packager-status:running');
  });

  const buildContexts: {
    [key in Platform]?: BuildContext;
  } = {};

  devServer.get('/index.bundle', async (req, res) => {
    const { platform, dev, minify } = req.query as unknown as BundleQuery;
    let buildContext = buildContexts[platform];
    if (!buildContext) {
      buildContext = await BuildContext.create({
        root,
        platform,
        dev: dev === 'true',
        minify: minify === 'true',
        write: false,
        sourcemap: 'inline',
      });
      buildContexts[platform] = buildContext;
    }

    const result = await buildContext.build();
    res.status(200).send(result.outputFiles?.[0]?.text);
  });

  devServer.listen(port, host, () => {
    console.log(`Dev server running on ${host}:${port}`);
  });

  return {
    stop: () => {},
  };
}
