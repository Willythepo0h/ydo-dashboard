import { useEffect, useRef, useState } from "react";
import type { RawCsvRow } from "../services/csv/types";
import type { Filters } from "../pages/dashboard-summary/useSummaryFilters";

export function useFilteredRowsWorker(
  rows: RawCsvRow[],
  filters: Filters,
): RawCsvRow[] {
  const [result, setResult] = useState<RawCsvRow[]>(rows);
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);

  // Create worker ONCE
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/filterWorker.ts", import.meta.url),
      { type: "module" },
    );

    const worker = workerRef.current;

    worker.onmessage = (e) => {
      const { requestId, data } = e.data;
      if (requestId === requestIdRef.current) {
        setResult(data);
      }
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // Send work when rows or filters change
  useEffect(() => {
    if (!rows.length) {
      setResult(rows);
      return;
    }

    const hasActiveFilters = Object.values(filters).some(
      (v) => v && v.length > 0,
    );

    if (!hasActiveFilters) {
      setResult(rows);
      return;
    }

    const requestId = ++requestIdRef.current;

    workerRef.current?.postMessage({
      requestId,
      rows,
      filters,
    });
  }, [rows, filters]);

  return result;
}
