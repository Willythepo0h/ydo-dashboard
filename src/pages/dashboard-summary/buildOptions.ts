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