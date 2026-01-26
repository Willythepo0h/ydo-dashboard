// Responsibility: fetch the CSV file from your Google Sheets endpoint.
// Output: raw CSV text.

let cachedText: string | null = null;
let cachedAt = 0;

type FetchCsvOption = {
  ttlMs?: number;
  force?: boolean;
  signal?: AbortSignal;
  retries?: number;
};

export async function fetchCsv(options: FetchCsvOption = {}): Promise<string> {
  const url = import.meta.env.VITE_SCHOLARSHIP_CSV_URL;
  if (!url) {
    throw new Error("CSV URL is not defined in environment variables");
  }

  const ttlMs = options.ttlMs ?? 5 * 60 * 1000;
  const now = Date.now();

  if (!options.force && cachedText && now - cachedAt < ttlMs) {
    return cachedText;
  }

  const retries = options.retries ?? 2;
  let attempt = 0;
  let text: string | null = null;
  const start = performance.now();

  while (attempt <= retries) {
    try {
      const response = await fetch(url, {
        method: "GET",
        signal: options.signal,
        headers: { Accept: "text/csv/,*/*" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      text = await response.text();

      if (!text.trim()) throw new Error("Fetched CSV is empty");

      cachedText = text;
      cachedAt = now;
      console.log(
        `fetchCsv: fetched CSV in ${(performance.now() - start).toFixed(2)}ms`,
      );
      return text;
    } catch (err) {
      if (attempt === retries) throw err;
      attempt++;
      console.warn(`fetchCsv: attempt ${attempt} failed, retrying...`);
      await new Promise((res) => setTimeout(res, 500 * attempt)); 
    }
  }

  throw new Error("Failed to fetch CSV after retries");
}
