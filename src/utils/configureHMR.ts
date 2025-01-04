import { type Server as ServerType } from 'http';
import type BuildContext from './BuildContext';
import { WebSocketServer } from 'ws';

interface Client {
  id: string;
  platform: string;
  ws: WebSocket;
}

const configureHMR = (
  root: string,
  server: ServerType,
  buildContextOf: { [key: string]: BuildContext }
) => {
  const clients = new Map<string, Client>();

  const wss = new WebSocketServer({ noServer: true });

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
      clients.set(clientId, {
        id: clientId,
        platform,
        // @ts-ignore
        ws,
      });
    });
  });

  server.on('close', () => {
    wss.close();
  });

  return () => {};
};

export default configureHMR;
