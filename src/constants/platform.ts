export const platforms = ['android', 'ios'] as const;
export type Platform = (typeof platforms)[number];
export const validatePlatform = (platform: any) => {
  if (typeof platform !== 'string' || !platform) {
    return false;
  }
  return (platforms as any).includes(platform);
};
