import dedent from 'dedent';
import type { ChainingLoader } from './makePluginByChangingLoaders';
import path from 'path';
import type { Loader } from 'esbuild';

export default (
  filter: (path: string, contents?: string) => boolean
): ChainingLoader => {
  return {
    load(prevResult, originArgs) {
      const loader = path.extname(originArgs.path).slice(1) as Loader;
      const contents =
        prevResult.contents instanceof Uint8Array
          ? Buffer.from(prevResult.contents).toString()
          : prevResult.contents;

      if (!filter(originArgs.path, contents)) {
        return;
      }

      // In a part of `react-navigation`, when prevRefreshSig is undefined and restored to this value,
      // executing $RefreshSig$ in the contents attempts to call undefined.
      // Is there an asynchronous call happening somewhere?
      // TODO: I'll check later. For now, it seems fine to fix it with `RefreshRuntime.createSignatureFunctionForTransform`. Setting it this way for now.
      return {
        contents:
          dedent`
          var RefreshRuntime = require("react-refresh/runtime");
          var prevRefreshReg = globalThis.$RefreshReg$;
          globalThis.$RefreshReg$ = (type, id) => {
            const fullId = "${originArgs.path}" + " " + id;
            RefreshRuntime.register(type, fullId);
          };
          globalThis.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
          ` +
          contents +
          dedent`
          globalThis.$RefreshReg$ = prevRefreshReg;
          RefreshRuntime.performReactRefresh();
        `,
        loader,
      };
    },
  };
};
