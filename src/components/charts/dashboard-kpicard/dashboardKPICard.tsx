import type React from "react";
import './dashboardKPICard.css'

interface KpiCardProps {
    label: string;
    icon?: React.ReactNode;
    value: number;
    total: number;
}

export function KpiCard({
    label,
    icon,
    value,
    total
}: KpiCardProps) {
    const pct = total > 0 ? (value / total) * 100 : 0;

    return (
        <div className="kpi-card-container">
            {icon && <div className="kpi-card-icon">{icon}</div>}
            <div className="kpi-card-content-wrapper">
                <div className="kpi-card-header">
                    <h2 className="kpi-card-label">
                        {label}
                    </h2>
                </div>

                <h3 className="kpi-card-value">
                    {value.toLocaleString()}
                </h3>

                <div className="kpi-card-subtext">
                    <span style={{ fontWeight: 600 }}>{pct.toFixed(1)}%</span> of {total.toLocaleString()} Scholars
                </div>
            </div>
        </div>
    )
}