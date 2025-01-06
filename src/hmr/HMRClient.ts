const __ESBUILD_HMR_PATH__ = 'hot';
const __ESBUILD_HMR_CLIENT_ID__ = [...Array(10)]
  .map(() => Math.random().toString(36)[2])
  .join('');

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
    const ws = new global.WebSocket(uri);
  },
  unstable_notifyFuseboxConsoleEnabled() {},
};
