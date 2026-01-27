/**
 * Normalizes raw CSV rows by adding computed age group information.
 *
 * Responsibilities:
 * - Converts the `AGE` field of each raw row into a typed `AGE_GROUP`
 * - Returns a new array of rows (`NormalizedRow[]`) including the age group
 *
 * This ensures that downstream processing (filtering, aggregation,
 * visualization) can rely on consistent, type-safe age-group data.
 */

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