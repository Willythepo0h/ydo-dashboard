export const renderPercentLabel = (value: number) => {
  if (!value || value < 3) return "";
  return `${value.toFixed(1)}%`;
};
