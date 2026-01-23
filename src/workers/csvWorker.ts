// Runs off the main thread (heavy lifting happens here)
// Responsibilities:
// 1. rebuild headers (if row 2 is the header)
// 2. parse CSV with PapaParse (worker: false here because this worker is already a separate thread)
// NOTE: optionally project only columns you need
// Input: raw CSV string
// Output: array of parsed objects

import Papa from "papaparse";

type WorkerMessage =
  | { type: "success"; data: Record<string, unknown>[] }
  | { type: "error"; error: string };

const ALLOWED_COLUMNS = new Set([
  "ACADEMIC YEAR COVER",
  "SCHOLARSHIP TYPE",
  "SEX",
  "LGBTQIA+",
  "AGE",
  "SCHOLARSHIP CATEGORY",
  "SUB-CATEGORY",
  "SCHOOL NAME",
  "SCHOOL CLASSIFICATION",
]);

self.onmessage = (event: MessageEvent<string>) => {
  const csvText = event.data;

  try {
    Papa.parse(csvText, {
      skipEmptyLines: true,
      dynamicTyping: true,
      fastMode: true,

      complete: (result) => {
        try {
          if (result.errors.length) {
            postError(result.errors.map((e) => e.message).join(", "));
            return;
          }

          const rows = result.data as unknown[][];

          if (rows.length < 2) {
            postError("CSV does not contain enough rows");
            return;
          }

          const headers = rows[1].map((h) => String(h).trim());
          const dataRows = rows.slice(2);

          const data = dataRows.map((row) => {
            const obj: Record<string, unknown> = {};
            
            headers.forEach((header, i) => {
              if (ALLOWED_COLUMNS.has(header)) {
                obj[header] = row[i];
              }
            });

            return Object.keys(obj).length ? obj : null;
          })
          .filter((row): row is Record<string, unknown> => row !== null)
          postSuccess(data);
        } catch (err) {
          postError(String(err));
        }
      },
    });
  } catch (err) {
    postError(String(err));
  }
};

function postSuccess(data: Record<string, unknown>[]) {
  self.postMessage({ type: "success", data } satisfies WorkerMessage);
}

function postError(error: string) {
  self.postMessage({ type: "error", error } satisfies WorkerMessage);
}
