/**
 * Worker-based CSV loading utility.
 *
 * Accepts raw CSV text, sends it to `csvWorker.ts` for parsing and
 * header normalization, and resolves with parsed `RawCsvRow[]`.
 * Designed to keep CSV processing off the main thread for
 * performance and UI responsiveness.
 */

import type { RawCsvRow, WorkerRequest, WorkerResponse } from "./types";

export function loadCsvWithWorker(
  csvText: string,
  options: { headerRowIndex?: number; allowedColumns?: string[] } = {},
): Promise<RawCsvRow[]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("../../workers/csvWorker.ts", import.meta.url),
      { type: "module" },
    );

    const handleMessage = (e: MessageEvent<WorkerResponse>) => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);

      if (e.data.type === "error") reject(new Error(e.data.error));
      else {
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
