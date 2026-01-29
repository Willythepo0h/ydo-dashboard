import './scholarshipCategoryTable.css'
import { formatNumber } from '../../../hooks/formatNumber'
import type { RawCsvRow } from '../../../services/csv/types'
import { useScholarshipCategoryPivot } from './useScholarshipCategoryPivot'

interface Props {
  rows: RawCsvRow[]
}

const ScholarshipCategoryTable = ({ rows }: Props) => {
  const { colKeys, matrix, rowGroups, colTotals } = useScholarshipCategoryPivot(rows)

  return (
    <div className="pivot-table-wrapper">
      <div className="pivot-table-border">
        <table className="pivot-table">
          <thead>
            <tr>
              <th className="pivot-table-column-header">SCHOLARSHIP CATEGORY</th>
              <th className="pivot-table-column-header">SUB-CATEGORY</th>
              {colKeys.map(col => (
                <th key={col} className="acadyear-header">{col}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Object.entries(rowGroups).map(([category, subs]) =>
              subs.map((sub, idx) => {
                const rowKey = `${category}::${sub}` 
                return (
                  <tr key={rowKey}>
                    {idx === 0 && (
                      <td rowSpan={subs.length} className='cell-clamp'>{category}</td>
                    )}
                    <td>{sub}</td>
                    {colKeys.map(col => (
                      <td key={col} className="scholar-count">
                        {formatNumber(matrix[rowKey]?.[col] ?? 0)}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
            <tr className="grand-total-row">
              <td colSpan={2}><strong>Total Scholars:</strong></td>
              {colKeys.map(col => (
                <td key={col} className="total-value">
                  <strong>{formatNumber(colTotals[col] ?? 0)}</strong>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ScholarshipCategoryTable