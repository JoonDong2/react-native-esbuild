const path = require('path');

const workspace = () => {
  return {
    name: 'resolve-workspaces',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        // 상대 경로나 절대 경로는 기본 해석 방식 사용
        if (args.path.startsWith('.') || path.isAbsolute(args.path)) {
          return;
        }

        // 현재 프로젝트와 Workspaces 루트의 node_modules를 순서대로 검색
        const currentProjectNodeModules = path.resolve(
          __dirname,
          'node_modules'
        );
        const workspaceRootNodeModules = path.resolve(
          __dirname,
          '../../node_modules'
        );

        return {
          path: require.resolve(args.path, {
            paths: [currentProjectNodeModules, workspaceRootNodeModules],
          }),
        };
      });
    },
  };
};

module.exports = workspace;
