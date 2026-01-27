/**
 * Utility for filtering out rows with unknown or unsupported age groups.
 *
 * This module enforces the use of a predefined set of known age groups
 * by removing any records that fall outside the allowed domain.
 *
 * It is typically applied after age-group normalization to ensure
 * downstream aggregations, tables, and charts operate on
 * clean, domain-valid data.
 */

import type { NormalizedRow } from './normalizeRows'
import type { KnownAgeGroup } from './ageGroupMap'
import { KNOWN_AGE_GROUPS } from './ageGroupMap'

export function excludeUnknownAgeGroups<
  T extends NormalizedRow
>(rows: T[]): T[] {
  return rows.filter(
    (r): r is T & { AGE_GROUP: KnownAgeGroup } =>
      KNOWN_AGE_GROUPS.includes(r.AGE_GROUP)
  )
}