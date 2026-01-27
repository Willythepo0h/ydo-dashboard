/**
 * Represents a single normalized row extracted from the CSV.
 *
 * - Keys correspond to normalized CSV headers
 * - Values are raw string values as provided by the source
 * - Used throughout the data pipeline and visualization layers
 */

export type RawCsvRow = Record<string, string>;

export type WorkerRequest = {
  csvText: string;
  headerRowIndex?: number;        
  allowedColumns?: string[];    
};

export type WorkerResponse =
  | { type: "success"; data: Record<string, string | number | undefined>[] }
  | { type: "error"; error: string };