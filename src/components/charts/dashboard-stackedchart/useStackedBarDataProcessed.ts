import { useMemo } from "react";

export interface StackedDatum {
  name: string;
  [key: string]: number | string;
}

export interface YearMeta {
  total: number;
  growth?: number;
}

export function useStackedBarDataProcessed(data: StackedDatum[], keys: string[], sortByYear = true) {
  return useMemo(() => {
    const ordered = sortByYear
      ? [...data].sort((a, b) => {
          const getYear = (v: string) => Number(v.match(/\d{4}/)?.[0] ?? 0);
          return getYear(a.name as string) - getYear(b.name as string);
        })
      : data;

    const yearMeta: Record<string, YearMeta> = {};

    ordered.forEach((row, i) => {
      const total = keys.reduce((sum, k) => sum + (row[`${k}_raw`] ?? 0), 0);
      const prevTotal = i > 0
        ? keys.reduce((s, k) => s + (ordered[i - 1][`${k}_raw`] ?? 0), 0)
        : undefined;
      const growth = prevTotal && prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : undefined;

      yearMeta[row.name as string] = { total, growth };
    });

    return { ordered, yearMeta };
  }, [data, keys, sortByYear]);
}
