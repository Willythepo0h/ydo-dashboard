import type { RawCsvRow } from "../../../services/csv/types";
import { isCosReleased } from "../../../utils/useScholarshipPredicates";
import './dashboard-summary-section.css'

import maleIconURL from "../../../assets/icons/male-icon.svg";
import femaleIconURL from "../../../assets/icons/female-icon.svg";
import lgbtFlagURL from "../../../assets/icons/lgbtqia-flag-icon.svg";

import { GrowthTableChart } from "../../../components/tables/dashboard-growthTable/growthTable";
import { useGrowthTableData } from "../../../hooks/useGrowthTableData";
import { KpiProgressCard } from "../../../components/charts/dashboard-kpicard-progress/dashboardKPICardProgress";
import { useKpiCount } from "../../../hooks/useKPICount";
import { KpiCard } from "../../../components/charts/dashboard-kpicard/dashboardKPICard";
import ScholarshipCatBySex from "../../../components/tables/dashboard-catbysex-table/scholarshipCatBySex";
import { StackedBarChart } from "../../../components/charts/dashboard-stackedchart/dashboardStackedChart";
import { useStackedBarData } from "../../../hooks/useStackedBarChartData";
import { useTableChartData } from "../../../hooks/useTableChartData";
import { TableChart } from "../../../components/tables/dashboard-table-chart/dashboardTableChart";

interface Props {
  rows: RawCsvRow[];
}

export function ScholarDemographicsSection({ rows }: Props) {

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

    const { years: lgbtScholarshipCatyears, rows: lgbtScholarshipCatrows } =
    useTableChartData({
      rows,
      rowDimension: "SCHOLARSHIP CATEGORY",
      yearDimension: "ACADEMIC YEAR COVER",
      filter: (row) =>
        isCosReleased(row) && String(row["LGBTQIA+"] ?? "").trim() !== "",
    });

    const maleKpi = useKpiCount({
    rows,
    totalFilter: isCosReleased,
    valueFilter: (row) =>
      isCosReleased(row) && String(row["SEX"] ?? "").trim() == "Male",
    });

    const femaleKpi = useKpiCount({
        rows,
        totalFilter: isCosReleased,
        valueFilter: (row) =>
        isCosReleased(row) && String(row["SEX"] ?? "").trim() == "Female",
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

      {/* ================= SEX DISTRIBUTION ================= */}
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
              icon={
                <img
                  src={maleIconURL}
                  alt="Male Icon"
                  style={{ width: 100, height: 100 }}
                />
              }
            />

            <KpiProgressCard
              label="Female"
              value={femaleKpi.value}
              total={femaleKpi.total}
              color="#f06292"
              icon={
                <img
                  src={femaleIconURL}
                  alt="Female Icon"
                  style={{ width: 100, height: 100 }}
                />
              }
            />
          </div>
          
          {/* UPPER ROW */}
          <section className="dashboard-row two-column">
            <StackedBarChart
              title="SEX DISTRIBUTION BY SCHOLARSHIP CATEGORY"
              data={data}
              keys={keys}
              isPercent
              isHorizontal
              fillHeight
            />
            <ScholarshipCatBySex rows={rows} fillHeight/>
          </section>
          
          {/* MIDDLE ROW */}
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
                isHorizontal={false}
                fillHeight
              />
            </div>
          </section>

          {/* LOWER ROW */}
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
                title="YEAR-OVER-YEAR LGBTQA+ SCHOLAR % GROWTH"
                column="LGBTQA+"
                years={lgbtYears}
                rows={lgbtRows}
                fillHeight
              />
            </div>
          </section>
        </div>
      </section>

      {/* ================= AGE GROUP ================= */}
      {/* <section className="demographic-section">
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
      </section> */}
    </section>
    )
}
