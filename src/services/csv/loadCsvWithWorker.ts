// Responsibility: send raw CSV to the worker and get back parsed rows.
// Communicates with: workers/csvWorker.ts.
// Output: cleaned & parsed rows (array of objects) ready for React state.

import type { RawCsvRow } from "./types";

let worker: Worker | null = null;

function getWorker() {
  if (!worker) {
    worker = new Worker(
      new URL("../../workers/csvWorker.ts", import.meta.url),
      { type: "module" },
    );
  }
  return worker;
}

export function loadCsvWithWorker(csvText: string): Promise<RawCsvRow[]> {
  return new Promise((resolve, reject) => {
    const w = getWorker();

    const handleMessage = (e: MessageEvent) => {
      w.removeEventListener("message", handleMessage);
      w.removeEventListener("error", handleError);

      if (e.data.error) reject(e.data.error);
      else resolve(e.data.data);
    };

    const handleError = (err: ErrorEvent) => {
      w.removeEventListener("message", handleMessage);
      w.removeEventListener("error", handleError);
      reject(err);
    };

    w.addEventListener("message", handleMessage);
    w.addEventListener("error", handleError);

    w.postMessage(csvText);
  });
}
