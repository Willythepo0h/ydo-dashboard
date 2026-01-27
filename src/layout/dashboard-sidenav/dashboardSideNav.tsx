/**
 * Sidebar navigation component for the scholarship dashboard.
 *
 * Responsibilities:
 * - Renders a set of primary navigation buttons for switching
 *   between dashboard views (e.g., Summary, Fiscal Year)
 * - Highlights the currently active view
 * - Optionally displays a filter section passed as a prop
 *
 * Designed to provide consistent, accessible sidebar navigation
 * and filter access across all dashboard pages.
 */

import { useState } from "react";
import DashboardNavButton from "../../components/ui-elements/dashboard-navigation-button/dashboardNavButton";
import type { ReactNode } from "react";
import './dashboardSideNav.css'

interface SideNavigationProps {
  filter?: ReactNode;
}

const SideNavButtons = [
  { text: "SUMMARY", url: "#summary" },
  { text: "SINCE 2019", url: "#since-2019" },
  { text: "FISCAL YEAR", url: "#fiscal-year" },
  { text: "ACADEMIC YEAR", url: "#academic-year" },
  { text: "SEMESTER", url: "#semester" },
];

const DashboardSideNav = ({ filter }: SideNavigationProps) => {
  const [activeButton, setActiveButton] = useState<string>("SUMMARY");

  return (
    <aside className="dashboard-sidenav">
      <section className="dashboard-navbutton-wrapper">
        <h3 className="dashboard-sidenav-text">View By:</h3>
        {SideNavButtons.map((btn) => (
          <DashboardNavButton
            key={btn.text}
            nav_text={btn.text}
            nav_url={btn.url}
            isActive={activeButton === btn.text}
            onClick={() => setActiveButton(btn.text)}
          />
        ))}
      </section>

      {filter && (
        <section className="dashboard-navfilter-container">
          <h3 className="dashboard-sidenav-text">Filter By:</h3>
          {filter}
        </section>
      )}
    </aside>
  );
};

export default DashboardSideNav;
