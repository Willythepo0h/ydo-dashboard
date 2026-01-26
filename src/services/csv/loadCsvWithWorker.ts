// loadCsvWithWorker.ts
// Responsibility: send raw CSV to the worker and get back parsed rows.
// Communicates with: workers/csvWorker.ts.
// Output: cleaned & parsed rows (RawCsvRow[]) ready for React state.

import type { RawCsvRow, WorkerRequest, WorkerResponse } from "./types";

export function loadCsvWithWorker(
  csvText: string,
  options: { headerRowIndex?: number; allowedColumns?: string[] } = {},
): Promise<RawCsvRow[]> {
  return new Promise((resolve, reject) => {
    // Create a new worker per request (concurrent-safe)
    const worker = new Worker(
      new URL("../../workers/csvWorker.ts", import.meta.url),
      { type: "module" },
    );

    const handleMessage = (e: MessageEvent<WorkerResponse>) => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);

      if (e.data.type === "error") reject(new Error(e.data.error));
      else {
        // Worker already outputs RawCsvRow[] (all values are strings)
        resolve(e.data.data);
      }

      worker.terminate();
    };

    const handleError = (err: ErrorEvent) => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      worker.terminate();
      reject(err.error || new Error(err.message));
    };

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleError);

    const request: WorkerRequest = {
      csvText,
      headerRowIndex: options.headerRowIndex ?? 1,
      allowedColumns: options.allowedColumns,
    };

    worker.postMessage(request);
  });
}
