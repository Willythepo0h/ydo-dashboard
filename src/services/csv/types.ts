export type RawCsvRow = Record<string, string>;

export type WorkerRequest = {
  csvText: string;
  headerRowIndex?: number;        
  allowedColumns?: string[];    
};

export type WorkerResponse =
  | { type: "success"; data: Record<string, string | number | undefined>[] }
  | { type: "error"; error: string };