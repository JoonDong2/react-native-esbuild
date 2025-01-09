import type { BuildOptions } from 'esbuild';

export const getConfig = (path: string) => {
  try {
    return require(path);
  } catch (e) {
    return {};
  }
};

function isObject(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

interface Alias {
  find: string | RegExp;
  replacement: string;
  /**
   * Instructs the plugin to use an alternative resolving algorithm,
   * rather than the Rollup's resolver.
   * @default null
   */
  customResolver?: any;
}

type AliasOptions = readonly Alias[] | { [find: string]: string };

// https://github.com/vitejs/vite/issues/1363
// work around https://github.com/rollup/plugins/issues/759
function normalizeSingleAlias({
  find,
  replacement,
  customResolver,
}: Alias): Alias {
  if (
    typeof find === 'string' &&
    find[find.length - 1] === '/' &&
    replacement[replacement.length - 1] === '/'
  ) {
    find = find.slice(0, find.length - 1);
    replacement = replacement.slice(0, replacement.length - 1);
  }

  const alias: Alias = {
    find,
    replacement,
  };
  if (customResolver) {
    alias.customResolver = customResolver;
  }
  return alias;
}

function mergeAlias(
  a?: AliasOptions,
  b?: AliasOptions
): AliasOptions | undefined {
  if (!a) return b;
  if (!b) return a;
  if (isObject(a) && isObject(b)) {
    return { ...a, ...b };
  }
  // the order is flipped because the alias is resolved from top-down,
  // where the later should have higher priority
  return [...normalizeAlias(b), ...normalizeAlias(a)];
}

function normalizeAlias(o: AliasOptions = []): Alias[] {
  return Array.isArray(o)
    ? o.map(normalizeSingleAlias)
    : Object.keys(o).map((find) =>
        normalizeSingleAlias({
          find,
          replacement: (o as any)[find],
        })
      );
}

function backwardCompatibleWorkerPlugins(plugins: any) {
  if (Array.isArray(plugins)) {
    return plugins;
  }
  if (typeof plugins === 'function') {
    return plugins();
  }
  return [];
}

function arraify<T>(target: T | T[]): T[] {
  return Array.isArray(target) ? target : [target];
}

function mergeConfigRecursively(
  defaults: Record<string, any>,
  overrides: Record<string, any>,
  rootPath: string
) {
  const merged: Record<string, any> = { ...defaults };
  for (const key in overrides) {
    const value = overrides[key];
    if (value == null) {
      continue;
    }

    const existing = merged[key];

    if (existing == null) {
      merged[key] = value;
      continue;
    }

    // fields that require special handling
    if (key === 'alias' && (rootPath === 'resolve' || rootPath === '')) {
      merged[key] = mergeAlias(existing, value);
      continue;
    } else if (key === 'assetsInclude' && rootPath === '') {
      merged[key] = [].concat(existing, value);
      continue;
    } else if (
      key === 'noExternal' &&
      (rootPath === 'ssr' || rootPath === 'resolve') &&
      (existing === true || value === true)
    ) {
      merged[key] = true;
      continue;
    } else if (key === 'plugins' && rootPath === 'worker') {
      merged[key] = () => [
        ...backwardCompatibleWorkerPlugins(existing),
        ...backwardCompatibleWorkerPlugins(value),
      ];
      continue;
    } else if (key === 'server' && rootPath === 'server.hmr') {
      merged[key] = value;
      continue;
    }

    if (Array.isArray(existing) || Array.isArray(value)) {
      merged[key] = [...arraify(existing), ...arraify(value)];
      continue;
    }
    if (isObject(existing) && isObject(value)) {
      merged[key] = mergeConfigRecursively(
        existing,
        value,
        rootPath ? `${rootPath}.${key}` : key
      );
      continue;
    }

    merged[key] = value;
  }
  return merged;
}

export function mergeConfig<
  D extends Record<string, any>,
  O extends Record<string, any>,
>(
  defaults: D extends Function ? never : D,
  overrides: O extends Function ? never : O,
  isRoot = true
): Record<string, any> {
  if (typeof defaults === 'function' || typeof overrides === 'function') {
    throw new Error(`Cannot merge config in form of callback`);
  }

  return mergeConfigRecursively(defaults, overrides, isRoot ? '' : '.');
}

export const mergeEsbuildConfig = (
  ...configs: BuildOptions[]
): BuildOptions => {
  if (!Array.isArray(configs) || configs.length === 0) {
    throw new Error('empty configs !!');
  }

  if (configs.length === 1) {
    return configs[0]!;
  }

  const first = configs[0]!;
  const remains = configs.slice(1)!;

  return remains.reduce<BuildOptions>((acc, cur) => {
    return mergeConfig<BuildOptions, BuildOptions>(acc, cur);
  }, first);
};
