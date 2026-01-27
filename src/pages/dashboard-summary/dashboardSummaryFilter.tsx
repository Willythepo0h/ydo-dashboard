/**
 * Dashboard filter component for scholarship summary data.
 *
 * Responsibilities:
 * - Renders multiple filter dropdowns for academic year, scholarship type,
 *   scholarship category, school name, and school classification
 * - Handles multi-select and optional search functionality
 * - Updates the parent filter state using React transitions for
 *   smooth, non-blocking UI updates
 *
 * Designed to centralize filter UI and logic, ensuring consistent
 * filtering behavior across summary tables and charts.
 */

import { FilterDropdown } from "../../components/ui-elements/dashboard-filter-dropdown/dashboardFilterButton";
import type { Filters } from "./useSummaryFilters";

interface SummaryFiltersProp {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>
    options: {
        acadYear: string[];
        scholarshipType: string[];
        categories: string[];
        school: string[];
        schoolClassification: string[]
    };
    startTransition: React.TransitionStartFunction;
}

export function SummaryFilters({
    filters, setFilters, options, startTransition
}: SummaryFiltersProp) {
    return (
        <div className='filter-button-container'>
            <FilterDropdown
            label=''
            placeholder='Academic Year'
            options={options.acadYear}
            value={filters.acadYear}
            onChange={(v) =>
                startTransition(() => {
                setFilters(f => ({ ...f, acadYear: v }));
                })
            }
            searchable={false}
            multiSelect={true}
            />

            <FilterDropdown 
            label=''
            placeholder='Scholarship Type'
            options={options.scholarshipType}
            value={filters.scholarshipType}
            onChange={(v) =>
                startTransition(() => {
                setFilters(f => ({ ...f, scholarshipType: v }));
                })
            }
            searchable={false}
            multiSelect={true}
            />

            <FilterDropdown
            label=''
            placeholder="Scholarship Category"
            options={options.categories}
            value={filters.categories}
            onChange={(v) =>
                startTransition(() => {
                setFilters(f => ({ ...f, categories: v }));
                })
            }
            searchable={false}
            multiSelect={true}
            />

            <FilterDropdown
            label=''
            placeholder="School Name"
            options={options.school}
            value={filters.school}
            onChange={(v) =>
                startTransition(() => {
                setFilters(f => ({ ...f, school: v }));
                })
            }
            searchable={true}
            searchPlaceholder='Search School...'
            multiSelect={true}
            />

            <FilterDropdown 
            label=''
            placeholder='School Classification'
            options={options.schoolClassification}
            value={filters.schoolClassification}
            onChange={(v) =>
                startTransition(() => {
                setFilters(f => ({ ...f, schoolClassification: v }));
                })
            }
            searchable={false}
            multiSelect={true}
            />
        </div>
    )
}