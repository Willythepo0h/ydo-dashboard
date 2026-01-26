import type { RawCsvRow } from "../../../services/csv/types";
import { useScholarshipCatBySexPivot } from "./useScholarshipCatBySexPivot";

interface Props {
    rows: RawCsvRow[]
    fillHeight?: boolean
}

const ScholarshipCatBySex = ({ rows, fillHeight }: Props) => {
  const { rowGroups, colKeys, matrix, colTotals } = useScholarshipCatBySexPivot(rows)

  return (
    <div className={`pivot-table-wrapper ${fillHeight ? "fill-height" : ""}`}>
      <h3 style={{color: '#205781', textAlign: 'center', margin: '0.5rem 0 0.5rem 0'}}>
        ANNUAL SEX BREAKDOWN BY SCHOLARSHIP CATEGORY
      </h3>

      <div className="pivot-table-border">
        <table className="pivot-table">
          <thead>
            <tr>
              <th className="pivot-table-column-header">
                SCHOLARSHIP CATEGORY
              </th>
              <th className="pivot-table-column-header">
                SEX
              </th>
              {colKeys.map(col => (
                <th key={col} className="acadyear-header">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Object.entries(rowGroups).map(
              ([category, sexes]) =>
                sexes.map((sex, idx) => (
                  <tr key={`${category}-${sex}`}>
                    {idx === 0 && (
                      <td rowSpan={sexes.length}>
                        {category}
                      </td>
                    )}
                    <td>{sex}</td>
                    {colKeys.map(col => (
                      <td
                        className="scholar-count"
                        key={col}
                      >
                        {matrix[`${category}::${sex}`]?.[col].toLocaleString() ?? '0'}
                      </td>
                    ))}
                  </tr>
                ))
            )}

            <tr className="grand-total-row">
              <td colSpan={2}>
                <strong>Total Scholars:</strong>
              </td>
              {colKeys.map(col => (
                <td
                  className="total-value"
                  key={col}
                >
                  <strong>{colTotals[col].toLocaleString() ?? '0'}</strong>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ScholarshipCatBySex