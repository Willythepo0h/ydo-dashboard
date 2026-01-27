/**
 * Utility for determining active age-group columns in aggregated datasets.
 *
 * This module inspects derived age-group metrics and returns only the
 * age groups that are actually present in the data. It is primarily used
 * to dynamically drive table columns and chart series, avoiding the
 * rendering of empty or irrelevant age groups.
 *
 * Ensures consistent age-group ordering while remaining data-driven.
 */

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