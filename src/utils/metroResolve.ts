import packageFinder from 'find-package-json';
import fs from 'fs';
import nodePath from 'path';
import { getRelativePath } from './path';

const { resolve } = require('metro-resolver');

const getPackageJson = (from: string) => {
  const result = packageFinder(from).next();
  const filename = result.filename;
  if (!filename) return null;
  return {
    path: filename,
    object: result.value,
  };
};

interface Props {
  path: string;
  basefile: string;
  extensions: string[];
  mainFields: string[];
  platform: string;
  root: string;
  dev: boolean;
}

export const metroResolve = (props: Props) => {
  const { path, basefile, extensions, mainFields, platform, root, dev } = props;
  const resolution = resolve(
    {
      dev,
      sourceExts: extensions,
      assetExts: new Set(),
      doesFileExist: (filePath: string) => {
        return fs.existsSync(filePath);
      },
      getPackage: (absoluteModulePath: string) => {
        return getPackageJson(absoluteModulePath)?.object ?? null;
      },
      getPackageForModule: (absoluteModulePath: string) => {
        const result = getPackageJson(absoluteModulePath);
        if (!result) return null;
        return {
          packageJson: result.object,
          rootPath: nodePath.dirname(result.path),
          packageRelativePath: getRelativePath(result.path, root),
        };
      },
      mainFields,
      nodeModulesPaths: [],
      originModulePath: basefile,
      fileSystemLookup: (
        absoluteOrProjectRelativePath: string
      ):
        | { exists: true; type: 'f' | 'd'; realPath: string }
        | { exists: false } => {
        try {
          // Resolve the input path to an absolute path
          const resolvedPath = nodePath.resolve(absoluteOrProjectRelativePath);

          // Check if the path exists
          if (!fs.existsSync(resolvedPath)) {
            return { exists: false };
          }

          // Retrieve file stats
          const stats = fs.lstatSync(resolvedPath);

          // Determine if the path is a file or directory
          if (stats.isFile()) {
            return {
              exists: true,
              type: 'f',
              realPath: resolvedPath,
            };
          } else if (stats.isDirectory()) {
            return {
              exists: true,
              type: 'd',
              realPath: resolvedPath,
            };
          }

          // If the path exists but is neither a file nor a directory (e.g., symlink)
          return { exists: false };
        } catch (error) {
          // Handle unexpected errors (e.g., permissions issues)
          console.error('Error in fileSystemLookup:', error);
          return { exists: false };
        }
      },
    },
    path,
    platform
  );

  return resolution.filePath;
};
