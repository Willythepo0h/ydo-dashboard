/**
 * Custom React hook for preparing tabular data for charts.
 *
 * Responsibilities:
 * - Aggregates rows by a row dimension and a year (or column) dimension
 * - Optionally applies a filter to include only certain rows
 * - Supports custom value accessors or defaults to counting each row as 1
 * - Returns structured data: sorted years and rows with values mapped per year
 *
 * Designed for use in dashboard table charts to provide consistent,
 * memoized data for rendering.
 */

import { useMemo } from "react";

interface UseTableChartDataOptions<T> {
  rows: T[];
  rowDimension: keyof T;
  yearDimension: keyof T;
  valueAccessor?: (row: T) => number;
  filter?: (row: T) => boolean;
}

export function useTableChartData<T>({
  rows,
  rowDimension,
  yearDimension,
  valueAccessor,
  filter,
}: UseTableChartDataOptions<T>) {
  return useMemo(() => {
    const tableMap: Record<string, Record<string, number>> = {};
    const yearSet = new Set<string>();

    rows.forEach((row) => {
      if (filter && !filter(row)) return;

      const label = String(row[rowDimension] ?? "").trim();
      const year = String(row[yearDimension] ?? "").trim();

      if (!label || !year) return;

      yearSet.add(year);

      tableMap[label] ??= {};
      tableMap[label][year] ??= 0;
      
      const value = valueAccessor ? valueAccessor(row) : 1;
      tableMap[label][year] += value;
    });

    const years = Array.from(yearSet).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );

    const rowsData = Object.entries(tableMap).map(([label, values]) => ({
      label,
      values,
    }));

    return {
      years,
      rows: rowsData,
    };
  }, [rows, rowDimension, yearDimension, valueAccessor, filter]);
}
