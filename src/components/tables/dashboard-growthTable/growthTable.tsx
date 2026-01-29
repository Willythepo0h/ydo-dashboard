import "./growthTable.css"
import type { GrowthValue } from "../../../hooks/useGrowthTableData";

export interface GrowthTableRow {
  label: string;
  values: Record<string, number>;
  growth: Record<string, GrowthValue>;
}

interface GrowthTableProps {
  title?: string;
  column?: string;
  years: string[];
  rows: GrowthTableRow[];
  fillHeight?: boolean;
}

export function GrowthTableChart({
  title,
  column,
  years,
  rows,
  fillHeight = false,
}: GrowthTableProps) {
  return (
    <div className={`growth-table-wrapper ${fillHeight ? "fill-height" : ""}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="growth-table-body">
        <table className="growth-table">
          <thead>
            <tr>
              <th>{column}</th>
              {years.map((year) => (
                <th key={year}>{year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="cell-clamp">{row.label}</td>
                {years.map((year, i) => {
                  const value = row.values[year] ?? 0;
                  const growth = row.growth[year];

                  let growthClass = "neutral";
                  let growthText = "-";

                  if (growth?.pct != null) {
                    growthClass =
                      growth.pct > 0
                        ? "positive"
                        : growth.pct < 0
                        ? "negative"
                        : "neutral";

                    growthText = `${growth.pct > 0 ? "+" : ""}${growth.pct.toFixed(1)}%`;
                  }

                  return (
                    <td key={year}>
                      <div className="numeric-cell">
                        <div>{value.toLocaleString()}</div>
                        {i > 0 && (
                          <div className={`growth-value ${growthClass}`}>
                            {growthText}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
