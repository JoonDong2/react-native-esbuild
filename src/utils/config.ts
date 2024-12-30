export const getConfig = (path: string) => {
  try {
    return require(path);
  } catch (e) {
    return {};
  }
};
