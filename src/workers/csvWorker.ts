import Papa from "papaparse";
import type { WorkerRequest, WorkerResponse } from "../services/csv/types";

const DEFAULT_ALLOWED_COLUMNS = new Set([
  "ACADEMIC YEAR COVER",
  "SCHOLARSHIP TYPE",
  "SEX",
  "LGBTQIA+",
  "AGE",
  "SCHOLARSHIP CATEGORY",
  "SUB-CATEGORY",
  "SCHOOL NAME",
  "SCHOOL CLASSIFICATION",
  "PHASE 4:COS & CONTRACT RELEASING STATUS"
]);

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { csvText, allowedColumns, headerRowIndex = 1 } = event.data;

  const allowed = allowedColumns
    ? new Set(allowedColumns.map(c => c.toUpperCase()))
    : DEFAULT_ALLOWED_COLUMNS;

  const start = performance.now();

  Papa.parse<Record<string, string>>(csvText, {
    header: true,    
    skipFirstNLines: headerRowIndex,       
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toUpperCase(),
    complete: (result) => {
      try {
        if (result.errors.length) {
          postError(result.errors.map(e => e.message).join(", "));
          return;
        }

        const data = result.data.map(row => {
          const filteredRow: Record<string, string> = {};
          for (const key in row) {
            if (allowed.has(key)) {
              filteredRow[key] = row[key]?.trim() ?? "";
            }
          }
          return filteredRow;
        });

        console.log(
          `csvWorker: parsed ${data.length} rows in ${(performance.now() - start).toFixed(2)}ms`
        );

        console.log("First row keys:", Object.keys(data[0] ?? {}));
        console.log("First row full:", data[0]);

        postSuccess(data);
      } catch (err) {
        postError(String(err));
      }
    }
  });
};

function postSuccess(data: Record<string, string>[]) {
  const msg: WorkerResponse = { type: "success", data };
  self.postMessage(msg);
}

function postError(error: string) {
  const msg: WorkerResponse = { type: "error", error };
  self.postMessage(msg);
}
