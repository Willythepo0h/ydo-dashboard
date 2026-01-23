// Responsibility: unify the pipeline for the rest of the app.

import { fetchCsv } from "./fetchCsv";
import { loadCsvWithWorker } from "./loadCsvWithWorker";

export async function loadScholarshipData() {
  const csvText = await fetchCsv();
  return loadCsvWithWorker(csvText);
}
