import type { RawCsvRow } from '../../services/csv/types'
import type { AgeGroup } from './ageGroupMap'
import { getAgeGroup } from './ageGroupMap'

export interface NormalizedRow extends RawCsvRow {
  AGE_GROUP: AgeGroup
}

export function normalizeRows(
  rows: RawCsvRow[]
): NormalizedRow[] {
  return rows.map(row => ({
    ...row,
    AGE_GROUP: getAgeGroup(Number(row.AGE)),
  }))
}