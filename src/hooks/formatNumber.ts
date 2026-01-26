export const formatNumber = (n: number) =>
  new Intl.NumberFormat("en-US").format(n);