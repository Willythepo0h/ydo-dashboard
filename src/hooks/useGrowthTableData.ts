import { useMemo } from "react";
import type { RawCsvRow } from "../services/csv/types";

export interface GrowthValue {
  value: number | null;
  pct: number | null;
}

interface UseGrowthTableDataOptions {
  rows: RawCsvRow[];
  rowDimension: keyof RawCsvRow;   
  yearDimension: keyof RawCsvRow;  
  filter?: (row: RawCsvRow) => boolean;
}

export function useGrowthTableData({
  rows,
  rowDimension,
  yearDimension,
  filter,
}: UseGrowthTableDataOptions) {
  return useMemo(() => {
    const tableMap: Record<string, Record<string, number>> = {};
    const yearSet = new Set<string>();

    // Aggregate counts by row label and year
    rows.forEach((row) => {
      if (filter && !filter(row)) return;

      const label = String(row[rowDimension] ?? "").trim();
      const year = String(row[yearDimension] ?? "").trim();

      if (!label || !year) return;

      yearSet.add(year);
      tableMap[label] ??= {};
      tableMap[label][year] = (tableMap[label][year] ?? 0) + 1;
    });

    const years = Array.from(yearSet).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );

    // Build the growth rows
    const rowsData = Object.entries(tableMap).map(([label, yearCounts]) => {
      const growth: Record<string, GrowthValue> = {};

      for (let i = 1; i < years.length; i++) {
        const prev = yearCounts[years[i - 1]] ?? 0;
        const curr = yearCounts[years[i]] ?? 0;

        if (prev === 0) {
          growth[years[i]] = { value: null, pct: null };
        } else {
          growth[years[i]] = {
            value: curr - prev,
            pct: ((curr - prev) / prev) * 100,
          };
        }
      }

      return {
        label,
        values: yearCounts,
        growth,
      };
    });

    return { years, rows: rowsData };
  }, [rows, rowDimension, yearDimension, filter]);
}
