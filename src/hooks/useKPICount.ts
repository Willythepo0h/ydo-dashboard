import { useMemo } from "react";
import type { RawCsvRow } from "../services/csv/types";

interface UseKpiCountOptions {
  rows: RawCsvRow[];
  valueFilter?: (row: RawCsvRow) => boolean;
  totalFilter?: (row: RawCsvRow) => boolean;
}

export function useKpiCount({
  rows,
  valueFilter,
  totalFilter,
}: UseKpiCountOptions) {
  return useMemo(() => {
    let value = 0;
    let total = 0;

    rows.forEach((row) => {
      // Count total rows matching totalFilter (or all if undefined)
      if (!totalFilter || totalFilter(row)) {
        total += 1;
      }

      // Count value rows that match valueFilter AND totalFilter (if provided)
      if ((!valueFilter || valueFilter(row)) && (!totalFilter || totalFilter(row))) {
        value += 1;
      }
    });

    const pct = total > 0 ? (value / total) * 100 : 0;

    return { value, total, pct };
  }, [rows, valueFilter, totalFilter]);
}
