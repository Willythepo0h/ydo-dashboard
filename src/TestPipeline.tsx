import { useEffect, useState } from "react";
import Papa from "papaparse";

const CSV_URL = import.meta.env.VITE_SCHOLARSHIP_CSV_URL;

export default function TestPipeline() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAndParseCsv() {
      try {
        setLoading(true);
        const res = await fetch(CSV_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const csvText = await res.text();

        // Parse CSV with worker
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          worker: true,
          complete: (results) => {
            setRows(results.data as any[]);
            setLoading(false);
            console.log("Parsed rows:", results.data);
          },
          error: (err) => {
            setError(err.message);
            setLoading(false);
          },
        });
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchAndParseCsv();
  }, []);

  if (loading) return <div>Loading CSV...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h2>Test Pipeline</h2>
      <div>Total rows parsed: {rows.length}</div>
      <pre style={{ maxHeight: "400px", overflow: "auto" }}>
        {JSON.stringify(rows.slice(2, 10), null, 2)}
      </pre>
    </div>
  );
}
