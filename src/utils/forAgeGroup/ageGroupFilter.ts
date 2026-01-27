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