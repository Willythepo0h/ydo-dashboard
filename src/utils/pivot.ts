/**
 * Generic pivot-table utility for counting two-dimensional categorical data.
 *
 * This module provides a reusable helper for transforming a flat dataset
 * into a pivot-style structure (row × column counts), suitable for
 * tables, heatmaps, and aggregated charting.
 *
 * Features:
 * - Single-pass aggregation for performance
 * - Configurable row and column key selectors
 * - Optional row-level filtering
 * - Precomputed column totals for summary views
 *
 * Designed for analytics-heavy dashboard components where flexible,
 * type-safe aggregation is required.
 */

export type PivotResult<RowKey extends string, ColKey extends string> = {
  rowKeys: RowKey[]
  colKeys: ColKey[]
  matrix: Record<RowKey, Record<ColKey, number>>
  colTotals: Record<ColKey, number>
}

interface PivotConfig<T, RowKey extends string, ColKey extends string> {
  rows: T[]
  getRowKey: (row: T) => RowKey | null
  getColKey: (row: T) => ColKey | null
  filter?: (row: T) => boolean
}

/**
 * Pivot table counter.
 * Efficient single-pass count of rowKey x colKey combinations.
 */
export function pivotCount<T, RowKey extends string, ColKey extends string>({
  rows,
  getRowKey,
  getColKey,
  filter,
}: PivotConfig<T, RowKey, ColKey>): PivotResult<RowKey, ColKey> {
  const matrix: Record<RowKey, Record<ColKey, number>> = {} as Record<RowKey, Record<ColKey, number>>
  const colTotals: Record<ColKey, number> = {} as Record<ColKey, number>
  const rowKeySet = new Set<RowKey>()
  const colKeySet = new Set<ColKey>()

  for (const row of rows) {
    if (filter && !filter(row)) continue

    const r = getRowKey(row)
    const c = getColKey(row)
    if (!r || !c) continue

    rowKeySet.add(r)
    colKeySet.add(c)

    if (!matrix[r]) matrix[r] = {} as Record<ColKey, number>
    matrix[r][c] = (matrix[r][c] ?? 0) + 1
    colTotals[c] = (colTotals[c] ?? 0) + 1
  }

  return {
    rowKeys: Array.from(rowKeySet), 
    colKeys: Array.from(colKeySet).sort(),
    matrix,
    colTotals,
  }
}
