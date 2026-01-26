import { useMemo, useState } from "react";
import type { RawCsvRow } from "../../services/csv/types";

export interface Filters {
  acadYear: string[] | null;
  scholarshipType: string[] | null;
  categories: string[] | null;
  school: string[] | null;
  schoolClassification: string[] | null;
}

const EMPTY_FILTERS: Filters = {
  acadYear: null,
  scholarshipType: null,
  categories: null,
  school: null,
  schoolClassification: null,
};

export function useSummaryFilters(rows: RawCsvRow[]) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const options = useMemo(() => {
    const acadYear = new Set<string>();
    const scholarshipType = new Set<string>();
    const categories = new Set<string>();
    const school = new Set<string>();
    const schoolClassification = new Set<string>();

    for (const r of rows) {
      if (r["ACADEMIC YEAR COVER"]) acadYear.add(r["ACADEMIC YEAR COVER"]);
      if (r["SCHOLARSHIP TYPE"]) scholarshipType.add(r["SCHOLARSHIP TYPE"]);
      if (r["SCHOLARSHIP CATEGORY"]) categories.add(r["SCHOLARSHIP CATEGORY"]);
      if (r["SCHOOL NAME"]) school.add(r["SCHOOL NAME"]);
      if (r["SCHOOL CLASSIFICATION"]) schoolClassification.add(r["SCHOOL CLASSIFICATION"]);
    }

    return {
      acadYear: Array.from(acadYear).sort(),
      scholarshipType: Array.from(scholarshipType).sort(),
      categories: Array.from(categories).sort(),
      school: Array.from(school).sort(),
      schoolClassification: Array.from(schoolClassification).sort(),
    };
  }, [rows]);

  return {
    filters,
    setFilters,
    options,
  };
}
