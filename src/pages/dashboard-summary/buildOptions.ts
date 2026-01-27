/**
 * Generates a sorted list of unique string values from a specific column
 * in a dataset of raw CSV rows.
 *
 * Responsibilities:
 * - Extracts values from the specified key
 * - Trims whitespace and removes empty or null values
 * - Produces a sorted, deduplicated array of strings
 *
 * Commonly used to populate filter dropdowns or selection lists
 * in dashboards and tables.
 */

import type { RawCsvRow } from "../../services/csv/types"

export function buildOptions(
  rows: RawCsvRow[],
  key: keyof RawCsvRow
  ): string[] {
    return Array.from(
      new Set(
        rows
          .map(r => r[key]?.trim())
          .filter((v): v is string => Boolean(v))
      )
    ).sort()
  }