const __ESBUILD_HMR_PATH__ = 'hot';
const __ESBUILD_HMR_CLIENT_ID__ = [...Array(10)]
  .map(() => Math.random().toString(36)[2])
  .join('');

const connect = (uri: string) => {
  const ws = new global.WebSocket(uri);
  ws.onclose = function onclose() {
    setTimeout(() => {
      ws.close();
      connect(uri);
    }, 1000);
  };

  ws.onmessage = (event) => {
    const { file, contents, type } = JSON.parse(event.data);
    switch (type) {
      case 'update':
        require('react-native-esbuild').evaluateJavascript(contents);
    }
  };

  return ws;
};

module.exports = {
  enabled: false,
  enable() {
    this.enabled = true;
  },
  disable() {
    this.enabled = false;
  },
  registerBundle() {},
  log() {
    // transfer a message to Logger on Dev Server
  },
  setup(
    platform: string,
    bundleEntry: string,
    host: string,
    port: number | string,
    isEnabled: boolean,
    scheme = 'ws'
  ) {
    if (!isEnabled) return;
    const uri = `${scheme}://${host}:${port}/${__ESBUILD_HMR_PATH__}?platform=${platform}&client_id=${__ESBUILD_HMR_CLIENT_ID__}`;
    connect(uri);
  },
  unstable_notifyFuseboxConsoleEnabled() {},
};
