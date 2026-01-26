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