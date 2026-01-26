interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
  total: number;
}

export function CustomTooltip({ active, payload, label, total }: CustomTooltipProps) {
  if (!active || !payload?.length || payload[0]?.value == null) return null;

  const value = payload[0].value;
  const percent = total ? ((value / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      <p className="tooltip-value">
        {value.toLocaleString()} ({percent}%)
      </p>
    </div>
  );
}
