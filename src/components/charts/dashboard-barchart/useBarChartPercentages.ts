import { useMemo } from "react";

interface BarDatum {
  name: string;
  value: number;
}

export function useBarChartPercentages(data: BarDatum[]) {
  return useMemo(() => {
    const total = data.reduce((sum, d) => sum + d.value, 0);

    const ordered = [...data].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const percentChangeMap: Record<string, string> = {};
    const absoluteValueMap: Record<string, number> = {};

    ordered.forEach((current, i) => {
      absoluteValueMap[current.name] = current.value;

      if (i === 0) {
        percentChangeMap[current.name] = "-";
        return;
      }

      const prev = ordered[i - 1].value;

      if (prev === 0) {
        percentChangeMap[current.name] = "N/A";
      } else {
        const change = ((current.value - prev) / prev) * 100;
        percentChangeMap[current.name] =
          `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
      }
    });

    return { total, ordered, percentChangeMap, absoluteValueMap };
  }, [data]);
}
