import ScholarshipCategoryTable from "../../../components/tables/dashboard-scholarshipCategory-table/scholarshipCategoryTable";
import { BarChart } from "../../../components/charts/dashboard-barchart/dashboardBarChart";
import { useGrowthTableData } from "../../../hooks/useGrowthTableData";
import { GrowthTableChart } from "../../../components/tables/dashboard-growthTable/growthTable";

import type { RawCsvRow } from "../../../services/csv/types";
import {
  useScholarshipCategoryCharts,
  CONFIG,
} from "./useScholarshipCategoryCharts";
import { isCosReleased } from "../../../utils/useScholarshipPredicates";

import "./dashboard-summary-section.css";

interface Props {
  rows: RawCsvRow[];
}

export function ScholarshipCategorySection({ rows }: Props) {
  const chartData = useScholarshipCategoryCharts(rows);

  const { years, rows: growthRows } = useGrowthTableData({
    rows,
    rowDimension: "SCHOLARSHIP CATEGORY",
    yearDimension: "ACADEMIC YEAR COVER",
    filter: isCosReleased,
  });

  return (
    <section className="scholarship-category-section">
      <h2 className="section-header">SCHOLARSHIP CATEGORY</h2>
      <div className="scholarship-category-wrapper">
        <ScholarshipCategoryTable rows={rows} />

        <div className="bar-chart-wrapper">
          <h3 className="bar-section-header">
            SCHOLARSHIP DISTRIBUTION BY SCHOLARSHIP CATEGORY
          </h3>

          <div className="bar-chart-container">
            {CONFIG.map((cfg, idx) => (
              <BarChart
                key={cfg.bucket}
                title={cfg.title}
                data={chartData[idx]}
              />
            ))}
          </div>
        </div>

        <div className="growth-table-wrapper">
          <GrowthTableChart
            title="YEAR-OVER-YEAR SCHOLAR %GROWTH BY SCHOLARSHIP CATEGORY"
            column="SCHOLARSHIP CATEGORY"
            years={years}
            rows={growthRows} 
            fillHeight
          />
        </div>
      </div>
    </section>
  );
}
