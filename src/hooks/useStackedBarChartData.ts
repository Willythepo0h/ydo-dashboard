import { useMemo } from "react";
import type { RawCsvRow } from "../services/csv/types";

interface UseStackedBarDataOptions {
  rows: RawCsvRow[];
  groupDimension: keyof RawCsvRow;
  stackDimension: keyof RawCsvRow;
  filter?: (row: RawCsvRow) => boolean;
  normalize?: boolean;
}

export function useStackedBarData({
  rows,
  groupDimension,
  stackDimension,
  filter,
  normalize = false,
}: UseStackedBarDataOptions) {
  return useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    const stackKeys = new Set<string>();

    rows.forEach((row) => {
      if (filter && !filter(row)) return;

      const group = String(row[groupDimension] ?? "").trim();
      const stack = String(row[stackDimension] ?? "").trim();

      if (!group || !stack) return;

      stackKeys.add(stack);
      map[group] ??= {};
      map[group][stack] = (map[group][stack] ?? 0) + 1;
    });

    const keys = Array.from(stackKeys);

    const data = Object.entries(map).map(([group, stacks]) => {
      const total = Object.values(stacks).reduce((a, b) => a + b, 0);

      const row: Record<string, number | string> = { name: group };

      keys.forEach((key) => {
        const raw = stacks[key] ?? 0;
        row[`${key}_raw`] = raw;
        row[key] = normalize && total > 0 ? (raw / total) * 100 : raw;
      });

      return row;
    });

    return { data, keys };
  }, [rows, groupDimension, stackDimension, filter, normalize]);
}
