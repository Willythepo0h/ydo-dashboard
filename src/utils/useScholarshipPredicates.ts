/**
 * Domain-specific utility predicates and normalization helpers
 * for scholarship data processing.
 *
 * This module centralizes:
 * - Common row-level predicates used across filters and aggregations
 * - String normalization helpers for consistent comparisons
 * - Scholarship category bucketing logic for chart-specific groupings
 *
 * Intended to reduce duplication and enforce consistent business rules
 * across data transformation and visualization layers.
 */

import type { RawCsvRow } from "../services/csv/types"

export const isCosReleased = (r: RawCsvRow) =>
    r['PHASE 4:COS & CONTRACT RELEASING STATUS'] === 'COS Released' && 
    r['ACADEMIC YEAR COVER'] !== ''

export function normalize(value?: string) {
    return value?.trim() ?? ''
}

// For barchart, specific purpose only
export function getScholarshipBucket(category?: string) {
    const c = category?.toLowerCase() ?? ''
    if (c.includes('senior high')) return 'SHS'
    if (c.includes('tertiary')) return 'TERTIARY'
    if (c.includes('post')) return 'POSTGRAD'
    if (c.includes('vocational')) return 'VOCATIONAL'
    return null
}