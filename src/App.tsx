import "./App.css";
import { useEffect } from "react";
import { fetchCsv } from "./services/csv/fetchCsv";
import { loadCsvWithWorker } from "./services/csv/loadCsvWithWorker";

function App() {
  useEffect(() => {
    async function load() {
      const csvText = await fetchCsv();
      const rows = await loadCsvWithWorker(csvText);

      console.log("Parsed rows:", rows.slice(0, 5));

      if (rows.length) {
        console.log("Returned columns:", Object.keys(rows[0]));
      }
    }

    load();
  }, []);

  return (
    <>
      <p className="read-the-docs">CSV Pipeline Test</p>
    </>
  );
}

export default App;
