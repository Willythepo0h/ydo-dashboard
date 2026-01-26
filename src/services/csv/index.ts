// index.ts
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
