export const mergeFilters = (
  filters?: (string | RegExp)[]
): undefined | RegExp => {
  const filtersWithoutFalsy = filters?.filter((regExp) => !!regExp);
  if (!Array.isArray(filtersWithoutFalsy) || filtersWithoutFalsy.length === 0) {
    return;
  }

  const combinedPattern = filtersWithoutFalsy
    .map((filter) => {
      return filter instanceof RegExp ? filter.source : filter;
    })
    .join('|');

  return new RegExp(combinedPattern);
};
