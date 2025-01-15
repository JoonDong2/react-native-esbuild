import { type Server as ServerType } from 'http';
import BuildContext from '../utils/BuildContext';
import { WebSocketServer } from 'ws';
// @ts-ignore
import { Gaze } from 'gaze';

import { groupBy } from 'lodash';
import addRefresh from '../plugins/esbuild/addRefresh';
import {
  getAbsolutePath,
  getRelativePath,
  removeLeadingSlash,
  toSnakeCase,
} from '../utils/path';
import { extractInputs, updateInputs } from '../utils/metafile';
import dedent from 'dedent';
import { getResolveExtensions } from '../constants/config';
import { transformAsync } from '@babel/core';
import { hasReactComponent } from '../utils/validate';
import addFullRefresh from '../plugins/esbuild/addFullRefresh';

interface Client {
  id: string;
  platform: string;
  ws: WebSocket;
}

type Event = 'changed' | 'added' | 'deleted' | 'all';

const configureHMR = (
  root: string,
  server: ServerType,
  buildContextOf: { [key: string]: BuildContext }
) => {
  const clients: {
    [key: string]: Client;
  } = {};

  const wss = new WebSocketServer({ noServer: true });

  const watcher = new Gaze(
    `**/*.{${['ts', 'tsx', 'js', 'jsx'].join(',')}}`,
    {
      cwd: root,
    },
    () => {
      console.log('watch start !');
    }
  );

  watcher.on('all', (event: Event, file: string) => {
    if (event !== 'added' && event !== 'changed') return;
    console.info(`${file} ${event} !`);
    if (Object.keys(clients).length === 0) return;
    const groupedByPlatform = groupBy(clients, 'platform');
    Object.keys(groupedByPlatform).forEach(async (platform) => {
      try {
        const inputs = extractInputs(buildContextOf[platform]?.last?.metafile);
        if (!inputs) return;

        const buildContext = await BuildContext.create({
          root,
          dev: true,
          minify: false,
          platform,
          entryFile: file,
          sourcemap: false,
          write: false,
          plugins: [
            {
              name: 'decide-external',
              setup(build) {
                build.onResolve({ filter: /\.*/ }, (args) => {
                  const absPath = getAbsolutePath({
                    path: args.path,
                    basefile: args.importer,
                    extensions: getResolveExtensions(platform),
                  });

                  const relativePath = getRelativePath(absPath, root);
                  // !args.importer is changed file
                  const external = !!args.importer && !!inputs[relativePath];
                  return {
                    external,
                    path: absPath,
                  };
                });
              },
            },
          ],
          scriptLoaders: [
            addRefresh(
              (_, contents) => !!contents && hasReactComponent(contents)
            ),
            addFullRefresh((path, contents) => {
              const relativePath = getRelativePath(path, root);
              const isNew = !inputs[relativePath];
              return !!contents && !hasReactComponent(contents) && !isNew;
            }),
            {
              include: [file],
              load(prevResult) {
                const snakedFileName = toSnakeCase(
                  removeLeadingSlash(file)
                ).toLocaleLowerCase();
                return {
                  loader: prevResult.loader,
                  contents: dedent`
                  var prev_require__${snakedFileName} = require__${snakedFileName};
                  var require__${snakedFileName} = __commonJS({
                    "${file}"(exports, module) {
                      ${prevResult.contents}
                    }
                  });
                  require__${snakedFileName}();
                  `,
                };
              },
            },
          ],
        });

        const result = await buildContext.build();
        const code = result.outputFiles?.[0]?.text;
        if (!code) {
          throw new Error('empty code !!');
        }

        updateInputs(inputs, extractInputs(result.metafile)!);

        const transformedCode = await transformAsync(code, {
          plugins: [
            require('../plugins/babel/replaceRequireToFunction')(platform),
          ],
          filename: file,
          compact: false,
          sourceMaps: false,
        });

        if (transformedCode === null) {
          throw new Error('babel failed !!');
        }

        const clients = groupedByPlatform[platform];
        clients?.forEach((client) => {
          client.ws.send(
            JSON.stringify({
              id: file,
              contents: transformedCode.code,
              type: 'update',
            })
          );
        });

        buildContext.dispose();
      } catch (e) {
        console.error('Build Error !!', e);
      }
    });
  });

  server.on('upgrade', (req, socket, head) => {
    const parsedUrl = new URL(req.url || '', 'http://localhost');

    if (parsedUrl.pathname !== '/hot') return;

    const platform = parsedUrl.searchParams.get('platform');
    if (!platform) {
      console.error('[HMR] no platform !!');
      return;
    }

    const clientId = parsedUrl.searchParams.get('client_id');
    if (!clientId) {
      console.error('[HMR] no client id !!');
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      console.info('connected with', { platform, clientId });
      clients[clientId] = {
        id: clientId,
        platform,
        // @ts-ignore
        ws,
      };
      ws.on('close', () => {
        delete clients[clientId];
      });
    });
  });

  server.on('close', () => {
    wss.close();
  });

  return () => {};
};

export default configureHMR;
