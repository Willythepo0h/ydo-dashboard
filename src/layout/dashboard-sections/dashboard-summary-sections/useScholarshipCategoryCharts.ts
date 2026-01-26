import { useBarChartData } from "../../../hooks/useBarChartData";
import { isCosReleased, getScholarshipBucket } from "../../../utils/useScholarshipPredicates";
import type { RawCsvRow } from "../../../services/csv/types";

export const CONFIG = [
  { title: "SENIOR HIGH SCHOOL", bucket: "SHS" },
  { title: "TERTIARY", bucket: "TERTIARY" },
  { title: "POSTGRADUATE", bucket: "POSTGRAD" },
  { title: "VOCATIONAL", bucket: "VOCATIONAL" },
] as const;

export function useScholarshipCategoryCharts(rows: RawCsvRow[]) {
  // Call useBarChartData for each bucket at top level
  const shsData = useBarChartData({
    rows,
    dimension: "ACADEMIC YEAR COVER",
    metric: (rs) => rs.filter(r => isCosReleased(r) && getScholarshipBucket(r["SCHOLARSHIP CATEGORY"]) === "SHS").length,
    normalize: (v) => v.trim(),
  });

  const tertiaryData = useBarChartData({
    rows,
    dimension: "ACADEMIC YEAR COVER",
    metric: (rs) => rs.filter(r => isCosReleased(r) && getScholarshipBucket(r["SCHOLARSHIP CATEGORY"]) === "TERTIARY").length,
    normalize: (v) => v.trim(),
  });

  const postgradData = useBarChartData({
    rows,
    dimension: "ACADEMIC YEAR COVER",
    metric: (rs) => rs.filter(r => isCosReleased(r) && getScholarshipBucket(r["SCHOLARSHIP CATEGORY"]) === "POSTGRAD").length,
    normalize: (v) => v.trim(),
  });

  const vocationalData = useBarChartData({
    rows,
    dimension: "ACADEMIC YEAR COVER",
    metric: (rs) => rs.filter(r => isCosReleased(r) && getScholarshipBucket(r["SCHOLARSHIP CATEGORY"]) === "VOCATIONAL").length,
    normalize: (v) => v.trim(),
  });

  return [shsData, tertiaryData, postgradData, vocationalData] as const;
}
