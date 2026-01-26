import { useEffect, useMemo, useState } from "react";
import { getScholarshipData } from "../services/csv";
import type { RawCsvRow } from "../services/csv/types";

let cachedRows: RawCsvRow[] | null = null;
let inflightPromise: Promise<RawCsvRow[]> | null = null;

export function useScholarshipData() {
  const [rows, setRows] = useState<RawCsvRow[]>(() => cachedRows ?? []);
  const [loading, setLoading] = useState(() => !cachedRows);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (cachedRows) return;

    if (!inflightPromise) {
      inflightPromise = getScholarshipData();
    }

    inflightPromise
      .then((data) => {
        cachedRows = data;
        if (!cancelled) setRows(data);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError("Failed to load scholarship data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Helper: get unique values for a column
   * Used by filter dropdowns
   */
  const getUniqueValues = useMemo(() => {
    return (column: string): string[] => {
      const set = new Set<string>();
      for (const row of rows) {
        const value = row[column];
        if (value) set.add(value);
      }
      return Array.from(set).sort();
    };
  }, [rows]);

  return {
    rows, 
    loading,
    error,
    getUniqueValues, 
  };
}
