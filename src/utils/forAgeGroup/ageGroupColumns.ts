import { KNOWN_AGE_GROUPS } from './ageGroupMap'
import type { AgeGroup } from './ageGroupMap'

export function getAgeGroupColumns<
  T extends Record<string, any>
>(
  data: T[],
  accessor: (row: T) => Partial<Record<AgeGroup, number>>
): AgeGroup[] {
  return KNOWN_AGE_GROUPS.filter(group =>
    data.some(row => accessor(row)?.[group] != null)
  )
}