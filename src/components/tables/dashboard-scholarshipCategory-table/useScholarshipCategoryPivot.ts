import { useMemo } from "react"
import type { RawCsvRow } from "../../../services/csv/types"
import { pivotCount } from "../../../utils/pivot"
import { normalizeSubCategory } from "../../../hooks/subCategoryNormalization"
import { useEffect } from "react"

export interface PivotData {
  rowKeys: string[]
  colKeys: string[]
  matrix: Record<string, Record<string, number>>
  colTotals: Record<string, number>
  rowGroups: Record<string, string[]> // category -> subcategories
}

/**
 * Encodes category + subcategory safely into a string key.
 * Replaces "::" in names with "—" to avoid collisions.
 */
function encodeRowKey(category: string, subCategory: string) {
  const safeCat = category.replace(/::/g, "—")
  const safeSub = subCategory.replace(/::/g, "—")
  return `${safeCat}::${safeSub}`
}

export function useScholarshipCategoryPivot(rows: RawCsvRow[]): PivotData {
  useEffect(() => {
    console.group("[ScholarshipCategoryPivot]")
    console.log("Rows length:", rows.length)
    console.log("Sample row:", rows[0])
    console.groupEnd()
  }, [rows])

  const { rowKeys, colKeys, matrix, colTotals } = useMemo(() => {
    return pivotCount({
      rows,
      getRowKey: (row) => {
        const category = row["SCHOLARSHIP CATEGORY"]?.trim()
        const rawSub = row["SUB-CATEGORY"]
        if (!category) return null
        const sub = normalizeSubCategory(category, rawSub)
        return encodeRowKey(category, sub)
      },
      getColKey: (row) => row["ACADEMIC YEAR COVER"]?.trim() ?? null,
      filter: (row) =>
         row["PHASE 4:COS & CONTRACT RELEASING STATUS"]?.trim() ===
         "COS Released",
    })
  }, [rows])

  const rowGroups = useMemo(() => {
    const map: Record<string, string[]> = {}
    rowKeys.forEach((rk) => {
      const [category, sub] = rk.split("::")
      map[category] ??= []
      map[category].push(sub)
    })
    return map
  }, [rowKeys])

  return { rowKeys, colKeys, matrix, colTotals, rowGroups }
}
