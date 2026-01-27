/**
 * Central access point for processed scholarship data.
 *
 * Abstracts the details of fetching, parsing, and caching CSV data,
 * exposing a single async API that returns normalized rows ready
 * for analytics, hooks, and charting layers.
 */

import { fetchCsv } from "./fetchCsv";
import { loadCsvWithWorker } from "./loadCsvWithWorker";
import type { RawCsvRow } from "./types";

let cachedData: RawCsvRow[] | null = null;

export async function getScholarshipData(): Promise<RawCsvRow[]> {
  if (cachedData) return cachedData;

  const csvText = await fetchCsv();
  const rows = await loadCsvWithWorker(csvText, { headerRowIndex: 1 });

  cachedData = rows;
  return rows;
}
