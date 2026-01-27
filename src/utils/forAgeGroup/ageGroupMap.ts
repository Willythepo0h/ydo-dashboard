export type KnownAgeGroup =
  | '13–15'
  | '16–18'
  | '19–22'
  | '23–30'
  | '31–Above'

export type AgeGroup = KnownAgeGroup | 'Unknown'

export const AGE_GROUP_ORDER: AgeGroup[] = [
  '13–15',
  '16–18',
  '19–22',
  '23–30',
  '31–Above',
  'Unknown',
]

export const KNOWN_AGE_GROUPS: readonly KnownAgeGroup[] = [
  '13–15',
  '16–18',
  '19–22',
  '23–30',
  '31–Above',
]

export function getAgeGroup(age?: number | null): AgeGroup {
  if (age == null || Number.isNaN(age)) return 'Unknown'
  if (age <= 15) return '13–15'
  if (age <= 18) return '16–18'
  if (age <= 22) return '19–22'
  if (age <= 30) return '23–30'
  return '31–Above'
}
