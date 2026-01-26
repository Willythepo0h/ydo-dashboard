import { useMemo } from "react";
import type { RawCsvRow } from "../../../services/csv/types";
import { pivotCount } from "../../../utils/pivot";

export function useScholarshipCatBySexPivot(rows: RawCsvRow[]) {
  const { rowKeys, colKeys, matrix, colTotals } = useMemo(
    () =>
      pivotCount({
        rows,
        getRowKey: (row) => {
          const category = row["SCHOLARSHIP CATEGORY"]?.trim();
          const sex = row["SEX"]?.trim();
          if (!category || !sex) return null;
          return `${category}::${sex}`;
        },
        getColKey: (row) =>
          row["ACADEMIC YEAR COVER"]?.trim() ?? null,
        filter: (row) =>
          row["PHASE 4:COS & CONTRACT RELEASING STATUS"]?.trim() ===
          "COS Released",
      }),
    [rows]
  );

  const rowGroups = useMemo(() => {
    const map: Record<string, string[]> = {};
    rowKeys.forEach((rk) => {
      const [category, sex] = rk.split("::");
      map[category] ??= [];
      map[category].push(sex);
    });
    return map;
  }, [rowKeys]);

  return { colKeys, matrix, colTotals, rowGroups };
}
