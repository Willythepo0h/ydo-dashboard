import type React from 'react';
import './dashboardKPICardProgress.css'

interface KpiProgressCardProps {
    label: string;
    icon?: React.ReactNode;
    value: number;
    total: number;
    color?: string;
}

export function KpiProgressCard({
    label,
    icon,
    value,
    total,
    color
}: KpiProgressCardProps) {
    const pct = total > 0 ? (value / total) * 100 : 0;

    return (
        <div className="kpi-card" style={{ border: '1px solid', borderColor: color}}>
            {icon && <div className='kpi-icon'>{icon}</div>}
            <div className="kpi-content-wrapper">
                <div className="kpi-header">
                    <span className='kpi-label' style={{ color }}>{label}</span>
                </div>

                <div className="kpi-value">
                    {value.toLocaleString()}
                </div>

                <div className="kpi-subtext" style={{ color }}>
                    {pct.toFixed(1)}% <span style={{ color: 'black'}}>of {total.toLocaleString()} Scholars </span>
                </div>

                <div className="kpi-progress">
                    <div className="kpi-progress-bar" 
                        style={{width: `${pct}%`, backgroundColor: color}}>
                    </div>
                </div>
            </div>
        </div>
    )
}