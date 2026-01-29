import type { RawCsvRow } from '../../../services/csv/types'
import { normalizeRows } from '../../../utils/forAgeGroup/normalizeRows'
import { excludeUnknownAgeGroups } from '../../../utils/forAgeGroup/ageGroupFilter'
import { isCosReleased } from '../../../utils/useScholarshipPredicates'
import { KNOWN_AGE_GROUPS } from '../../../utils/forAgeGroup/ageGroupMap'
import './ageGroupTable.css'

interface AgeGroupTableChartProps {
  title?: string
  rows: RawCsvRow[]
  rowDimension?: 'SCHOLARSHIP CATEGORY' // Note: just add | 'new column' for another row dimension
}

interface PivotedRow {
  label: string
  values: Record<string, number>
}

export function AgeGroupTableChart({ title, rows, rowDimension = 'SCHOLARSHIP CATEGORY' }: AgeGroupTableChartProps) {
  if (!rows.length) return null

  const filteredRows = excludeUnknownAgeGroups(normalizeRows(rows)).filter(isCosReleased)

  const pivotRows: Record<string, PivotedRow> = filteredRows.reduce((acc, row) => {
    const cat = row[rowDimension] ?? 'Unknown'
    const age = row.AGE_GROUP
    if (!acc[cat]) acc[cat] = { label: cat, values: {} }
    acc[cat].values[age] = (acc[cat].values[age] ?? 0) + 1
    return acc
  }, {} as Record<string, PivotedRow>)

  const finalRows: PivotedRow[] = Object.values(pivotRows).map(row => ({
    label: row.label,
    values: KNOWN_AGE_GROUPS.reduce((acc, group) => {
      acc[group] = row.values[group] ?? 0
      return acc
    }, {} as Record<string, number>)
  }))

  const columns: string[] = [...KNOWN_AGE_GROUPS]

  return (
    <div className="age-group-table-wrapper">
      {title && <h3 className="chart-title">{title}</h3>}
      <table className="age-group-table">
        <thead>
          <tr>
            <th className="cell-clamp">{rowDimension.replace('_', ' ')}</th>
            {columns.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {finalRows.map(row => (
            <tr key={row.label}>
              <td className="cell-clamp">{row.label}</td>
              {columns.map(col => (
                <td key={col}>{row.values[col].toLocaleString() ?? '0'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
