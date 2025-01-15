export const hasReactComponent = (contents: string) => {
  return /(?:\$RefreshReg\$|\$RefreshSig\$)/.test(contents);
};
