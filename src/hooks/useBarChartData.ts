import { useMemo } from "react";
import type { RawCsvRow } from "../services/csv/types";

export interface BarChartDatum {
  name: string;
  value: number;
}

interface UseBarChartDataOptions {
  rows: RawCsvRow[];
  dimension: keyof RawCsvRow;
  metric?: (rows: RawCsvRow[]) => number;
  normalize?: (v: string) => string;
}

export function useBarChartData({
  rows,
  dimension,
  metric,
  normalize = (v) => v.trim(),
}: UseBarChartDataOptions): BarChartDatum[] {
  return useMemo(() => {
    const map = new Map<string, RawCsvRow[]>();

    rows.forEach((row) => {
      const rawValue = row[dimension];

      if (rawValue !== null && rawValue !== undefined) {
        const key = normalize(String(rawValue));

        if (key) {
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(row);
        }
      }
    });

    const result: BarChartDatum[] = [];
    for (const [name, groupedRows] of map) {
      result.push({
        name,
        value: metric ? metric(groupedRows) : groupedRows.length,
      });
    }

    return result;
  }, [rows, dimension, metric, normalize]);
}
