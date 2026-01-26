interface CustomStackedTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  isPercent?: boolean;
  activeKey: string | null;
}

export function CustomStackedTooltip({ active, payload, label, isPercent, activeKey }: CustomStackedTooltipProps) {
  if (!active || !payload?.length) return null;

  const entries = activeKey ? payload.filter((p) => p.dataKey === activeKey) : payload;

  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {entries.map((entry) => {
        const key = entry.dataKey;
        const raw = entry.payload?.[`${key}_raw`];
        return (
          <p className="tooltip-value">
            <span style={{ color: entry.fill, fontWeight: 600 }}>{key}</span>: {raw?.toLocaleString()}
            {isPercent && ` (${entry.value.toFixed(1)}%)`}
          </p>
        );
      })}
    </div>
  );
}
