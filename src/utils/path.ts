import nodePath from 'path';
import { sync as resolveSync } from 'resolve';
import { getConditionNames, getMainFields } from '../constants/config';

// It is intended for searching node_modules and is not suitable for finding relative paths
import enhancedResolve from 'enhanced-resolve';

/*
 * NOTE: Ideally, esbuild should provide a module graph and resolver, but it does not offer such functionality.
 * It seems like the esbuild configuration has been implemented to closely resemble React Native's Metro defaults, but I'm not entirely sure.
 * Because of this, unlike Vite, React Native's lack of ESM support makes HMR with esbuild seem quite unstable.
 */
const resolveLibrary = enhancedResolve.create.sync({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  mainFields: getMainFields(),
  conditionNames: getConditionNames(),
});

export const getAbsolutePath = ({
  path,
  basefile,
  extensions,
}: {
  path: string;
  basefile?: string;
  extensions?: string[];
}) => {
  if (nodePath.isAbsolute(path)) return path;

  if (!basefile) {
    throw new Error("If it's not an absolute path, a base file is required.");
  }
  // relative path (require("./src"), require("../src"))
  if (path.startsWith('.')) {
    const basedir = nodePath.dirname(basefile);
    return resolveSync(nodePath.join(basedir, path), { extensions });
  }

  const absPath = resolveLibrary(basefile, path);
  if (!absPath) {
    throw new Error('cannot resolve !!');
  }
  return absPath;
};

export const removeLeadingSlash = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path;
};

export const toSnakeCase = (path: string) => {
  return path.replace(/[/.@-]/g, '_');
};

export const getRelativePath = (absPath: string, root: string) => {
  return nodePath.relative(root, absPath);
};
