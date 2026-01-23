// Responsibility: fetch the CSV file from your Google Sheets endpoint.
// Output: raw CSV text.

let cachedText: string | null = null
let cachedAt = 0

type FetchCsvOption = {
    ttlMs?: number
    force?: boolean
    signal?: AbortSignal
}

export async function fetchCsv(options: FetchCsvOption ={}): Promise<string> {
    const url = import.meta.env.VITE_SCHOLARSHIP_CSV_URL;
    if (!url) {
        throw new Error("CSV URL is not defined in environment variables");
    }

    const ttlMs = options.ttlMs ?? 5 * 60 * 1000
    const now = Date.now()

    if (!options.force && cachedText && now - cachedAt < ttlMs) {
        return cachedText
    }

    const response = await fetch(url, {
        method: "GET",
        signal: options.signal,
        headers:{
            "Accept": "text/csv/,*/*"
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status}`);
    }

    const text = await response.text()
    cachedText = text
    cachedAt = now
    return text
}