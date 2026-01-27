/**
 * Core layout component for the scholarship dashboard.
 *
 * Responsibilities:
 * - Renders the dashboard header (`DashboardHeader`) and side navigation (`DashboardSideNav`)
 * - Accepts an optional filter component to display in the sidebar
 * - Wraps the main content area where page-specific components are rendered
 *
 * Provides consistent layout structure and styling across all dashboard pages.
 */

import DashboardHeader from '../dashboard-header/dashboardHeader'
import DashboardSideNav from '../dashboard-sidenav/dashboardSideNav'

import type { ReactNode } from 'react'
import './dashboardLayout.css'

interface DashboardLayoutProps {
    filter?: ReactNode
    children: ReactNode
}

const DashboardLayout = ({ filter, children }: DashboardLayoutProps) => {
    return (
        <div className="dashboard-layout-root">
            <DashboardHeader />

            <div className="dashboard-layout-body">
                <DashboardSideNav filter={filter}/>

                <main className="dashboard-layout-content">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout