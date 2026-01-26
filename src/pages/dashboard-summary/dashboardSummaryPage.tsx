import './dashboardSummaryPage.css'
import { useEffect } from 'react';

// SummaryPage.tsx
// For hooks:
import { useScholarshipData } from "../../hooks/useScholarshipData";
import { useFilteredRowsWorker } from '../../hooks/useFilteredRowsWorker';

// For component imports:
import LoadingAnimation from '../../components/ui-elements/dashboard-loading-animation/dashboardLoadingAnimation';

// For layout imports:
import DashboardLayout from '../../layout/dashboard-layout/dashboardLayout';
import { ScholarshipCategorySection } from '../../layout/dashboard-sections/dashboard-summary-sections/scholarshipCategorySection';
import { ScholarDemographicsSection } from '../../layout/dashboard-sections/dashboard-summary-sections/scholarshipDemographicSection';
// Other dependencies:
import { useTransition } from "react";
import { SummaryFilters } from './dashboardSummaryFilter';
import { useSummaryFilters } from './useSummaryFilters';

export interface Filters {
  acadYear: string[] | null;
  scholarshipType: string[] | null;
  categories: string[] | null;
  school: string[] | null;
  schoolClassification: string[] | null;
}

export function SummaryPage() {
  const { rows, loading, error } = useScholarshipData();
  const [isPending, startTransition] = useTransition();

  const {
    filters,
    setFilters,
    options,
  } = useSummaryFilters(rows);

  const filteredRows = useFilteredRowsWorker(rows, filters);

  useEffect(() => {
  console.log("Filters changed:", filters);
  }, [filters]);

  return (
    <DashboardLayout
      filter={
        loading ? null : (
          <SummaryFilters
            filters={filters}
            setFilters={setFilters}
            options={options}
            startTransition={startTransition}
          />
        )
      }
    >
      {loading && <LoadingAnimation />}

      {!loading && !error && (
        <>
          {isPending && <LoadingAnimation />}

          <ScholarshipCategorySection rows={filteredRows} />
          <ScholarDemographicsSection rows={filteredRows} />
        </>
      )}

      {error && <div>{error}</div>}
    </DashboardLayout>
  );
}
