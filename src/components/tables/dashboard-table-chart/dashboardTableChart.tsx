import './dashboardTableChart.css'

interface TableChartRow {
    label: string;
    values: Record<string, number>
}

interface TableChartProps {
    title?: string;
    column?: string;
    rows: TableChartRow[];
    columns?: string[];
}

export function TableChart({ title, column, rows, columns }: TableChartProps) {
    if (!rows.length) return null;

    const resolvedColumns = columns ?? Object.keys(rows[0].values)

    const getCellClass = (curr: number, prev?: number) => {
        if (prev == null) return "-";
        if (curr > prev) return "cell-positive";
        if (curr < prev) return "cell-negative";
        return "cell-neutral";
    };

    return (
        <div className="table-chart-wrapper">
            {title && <h3 className='chart-title'>{title}</h3>}
            <table className="table-chart">
                <thead>
                    <tr>
                        <th>{column}</th>
                        {resolvedColumns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {rows.map((row) => (
                        <tr key={row.label}>
                            <td className="row-label">{row.label}</td>

                            {resolvedColumns.map((col, index) => {
                                const curr = row.values[col];
                                const prevCol = resolvedColumns[index - 1];
                                const prev = prevCol ? row.values[prevCol] : undefined;

                                return (
                                    <td key={col} className={getCellClass(curr, prev)}>
                                        {curr?.toLocaleString() ?? "-"}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}