import nodePath from 'path';

export const removeLeadingSlash = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path;
};

export const toSnakeCase = (path: string) => {
  return path.replace(/[/.@-]/g, '_');
};

export const getRelativePath = (absPath: string, root: string) => {
  return nodePath.relative(root, absPath);
};
