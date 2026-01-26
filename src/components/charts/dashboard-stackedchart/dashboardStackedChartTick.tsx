interface AcademicYearTickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
  yearMeta: Record<string, { total: number; growth?: number }>;
}

export function AcademicYearTick({ x, y, payload, yearMeta }: AcademicYearTickProps) {
  const meta = payload && payload.value ? yearMeta[payload.value] : undefined;
  if (!meta || x == null || y == null) return null;

  return (
    <g transform={`translate(${x},${y})`}>
      <text y={12} textAnchor="middle" fill="#000" fontSize={14} fontWeight={600}>
        {payload.value}
      </text>
      <text y={28} textAnchor="middle" fill="#000" fontSize={14}>
        {meta.total.toLocaleString()} Scholars
      </text>
      {meta.growth !== undefined && (
        <text y={44} textAnchor="middle" fontSize={12} fill={meta.growth >= 0 ? "#2e7d32" : "#c62828"}>
          {meta.growth >= 0 ? "+" : ""}
          {meta.growth.toFixed(1)}% from previous AY
        </text>
      )}
    </g>
  );
}
