// ============================ IMPORTS — TYPES, UTILS, STYLES ============================
import type { RawCsvRow } from "../../../services/csv/types";
import { isCosReleased } from "../../../utils/useScholarshipPredicates";
import "./dashboard-summary-section.css";

// ============================ ICON ASSETS ============================
import maleIconURL from "../../../assets/icons/male-icon.svg";
import femaleIconURL from "../../../assets/icons/female-icon.svg";
import lgbtFlagURL from "../../../assets/icons/lgbtqia-flag-icon.svg";

// ============================ COMPONENTS — TABLES & CHARTS ============================
import { GrowthTableChart } from "../../../components/tables/dashboard-growthTable/growthTable";
import { KpiProgressCard } from "../../../components/charts/dashboard-kpicard-progress/dashboardKPICardProgress";
import { KpiCard } from "../../../components/charts/dashboard-kpicard/dashboardKPICard";
import ScholarshipCatBySex from "../../../components/tables/dashboard-catbysex-table/scholarshipCatBySex";
import { StackedBarChart } from "../../../components/charts/dashboard-stackedchart/dashboardStackedChart";
import { TableChart } from "../../../components/tables/dashboard-table-chart/dashboardTableChart";
import { AgeGroupTableChart } from "../../../components/tables/dashboard-ageGroup-table/ageGroupTable";

// ============================ HOOKS — DATA PREPARATION ============================
import { useGrowthTableData } from "../../../hooks/useGrowthTableData";
import { useStackedBarData } from "../../../hooks/useStackedBarChartData";
import { useTableChartData } from "../../../hooks/useTableChartData";
import { useKpiCount } from "../../../hooks/useKPICount";

// ============================ AGE GROUP UTILITIES ============================
import { AGE_GROUP_ORDER } from "../../../utils/forAgeGroup/ageGroupMap";
import { excludeUnknownAgeGroups } from "../../../utils/forAgeGroup/ageGroupFilter";
import { normalizeRows } from "../../../utils/forAgeGroup/normalizeRows";

interface Props {
  rows: RawCsvRow[];
}

export function ScholarDemographicsSection({ rows }: Props) {
  const normalizedRows = excludeUnknownAgeGroups(normalizeRows(rows));

  // ============================ GROWTH TABLE DATA ============================
  const { years: ageYears, rows: ageGrowthRows } = useGrowthTableData({
    rows: normalizedRows,
    rowDimension: "AGE_GROUP",
    yearDimension: "ACADEMIC YEAR COVER",
    filter: isCosReleased,
  });

  const sortedAgeGrowthRows = [...ageGrowthRows].sort(
    (a, b) =>
      AGE_GROUP_ORDER.indexOf(a.label as any) -
      AGE_GROUP_ORDER.indexOf(b.label as any),
  );

  const { years, rows: growthRows } = useGrowthTableData({
    rows,
    rowDimension: "SEX",
    yearDimension: "ACADEMIC YEAR COVER",
    filter: isCosReleased,
  });

  const { years: lgbtYears, rows: lgbtRows } = useGrowthTableData({
    rows,
    rowDimension: "LGBTQIA+",
    yearDimension: "ACADEMIC YEAR COVER",
    filter: isCosReleased,
  });

  // ============================ STACKED BAR DATA ============================
  const { data, keys } = useStackedBarData({
    rows,
    groupDimension: "SCHOLARSHIP CATEGORY",
    stackDimension: "SEX",
    normalize: true,
    filter: isCosReleased,
  });

  const { data: classData, keys: classKeys } = useStackedBarData({
    rows,
    groupDimension: "SCHOLARSHIP TYPE",
    stackDimension: "SEX",
    normalize: true,
    filter: isCosReleased,
  });

  const { data: vertData, keys: vertKeys } = useStackedBarData({
    rows,
    groupDimension: "ACADEMIC YEAR COVER",
    stackDimension: "SEX",
    normalize: true,
    filter: isCosReleased,
  });

  // ============================ TABLE CHART DATA ============================
  const {
    years: lgbtScholarshipCatyears,
    rows: lgbtScholarshipCatrows,
  } = useTableChartData({
    rows,
    rowDimension: "SCHOLARSHIP CATEGORY",
    yearDimension: "ACADEMIC YEAR COVER",
    filter: (row) =>
      isCosReleased(row) && String(row["LGBTQIA+"] ?? "").trim() !== "",
  });

  // ============================ KPI COUNTS ============================
  const maleKpi = useKpiCount({
    rows,
    totalFilter: isCosReleased,
    valueFilter: (row) =>
      isCosReleased(row) && String(row["SEX"] ?? "").trim() === "Male",
  });

  const femaleKpi = useKpiCount({
    rows,
    totalFilter: isCosReleased,
    valueFilter: (row) =>
      isCosReleased(row) && String(row["SEX"] ?? "").trim() === "Female",
  });

  const lgbtKpi = useKpiCount({
    rows,
    totalFilter: isCosReleased,
    valueFilter: (row) =>
      isCosReleased(row) && String(row["LGBTQIA+"] ?? "").trim() !== "",
  });

  return (
    <section className="scholar-demographic-section">
      <h2 className="section-header">SCHOLAR DEMOGRAPHICS</h2>

      <section className="demographic-section">
        <h3 className="section-label">SEX DISTRIBUTION</h3>

        <div className="demographic-card">
          {/* KPI ROW */}
          <div className="kpi-row">
            <KpiProgressCard
              label="Male"
              value={maleKpi.value}
              total={maleKpi.total}
              color="#1565c0"
              icon={<img src={maleIconURL} alt="Male Icon" />}
            />

            <KpiProgressCard
              label="Female"
              value={femaleKpi.value}
              total={femaleKpi.total}
              color="#f06292"
              icon={<img src={femaleIconURL} alt="Female Icon" />}
            />
          </div>

          {/* CATEGORY + TABLE */}
          <section className="dashboard-row two-column">
            <StackedBarChart
              title="SEX DISTRIBUTION BY SCHOLARSHIP CATEGORY"
              data={data}
              keys={keys}
              isPercent
              isHorizontal
              fillHeight
            />
            <ScholarshipCatBySex rows={rows} fillHeight />
          </section>

          {/* CLASSIFICATION + GROWTH */}
          <section className="dashboard-row two-column">
            <div className="dashboard-column">
              <StackedBarChart
                title="SEX DISTRIBUTION BY SCHOLARS CLASSIFICATION"
                data={classData}
                keys={classKeys}
                isPercent
                isHorizontal
              />

              <GrowthTableChart
                title="YEAR-OVER-YEAR SCHOLAR % GROWTH BY SEX"
                column="SEX"
                years={years}
                rows={growthRows}
              />
            </div>

            <div className="dashboard-column center-vertical">
              <StackedBarChart
                title="SEX DISTRIBUTION ACROSS ACADEMIC YEARS"
                data={vertData}
                keys={vertKeys}
                isPercent
                fillHeight
              />
            </div>
          </section>

          {/* LGBTQIA+ */}
          <section className="dashboard-row two-column">
            <div className="dashboard-column center">
              <KpiCard
                label="LGBTQIA+"
                value={lgbtKpi.value}
                total={lgbtKpi.total}
                icon={<img src={lgbtFlagURL} alt="LGBT Flag" />}
              />

              <TableChart
                title="ANNUAL LGBTQIA+ BREAKDOWN BY SCHOLARSHIP CATEGORY"
                column="SCHOLARSHIP CATEGORY"
                rows={lgbtScholarshipCatrows}
                columns={lgbtScholarshipCatyears}
              />
            </div>

            <div className="dashboard-column stretch">
              <GrowthTableChart
                title="YEAR-OVER-YEAR LGBTQIA+ SCHOLAR % GROWTH"
                column="LGBTQA+"
                years={lgbtYears}
                rows={lgbtRows}
                fillHeight
              />
            </div>
          </section>
        </div>
      </section>

      {/* AGE GROUP DISTRIBUTION */}
      <section className="demographic-section">
        <h3 className="section-label">AGE GROUP DISTRIBUTION</h3>

        <div className="demographic-card">
          <div className="dashboard-row two-column">
            <AgeGroupTableChart
              title="SCHOLARSHIP CATEGORY BY AGE GROUP"
              rows={rows}
              rowDimension="SCHOLARSHIP CATEGORY"
            />

            <GrowthTableChart
              title="YEAR-OVER-YEAR SCHOLAR % GROWTH BY AGE GROUP"
              column="AGE GROUP"
              years={ageYears}
              rows={sortedAgeGrowthRows}
              fillHeight
            />
          </div>
        </div>
      </section>
    </section>
  );
}
