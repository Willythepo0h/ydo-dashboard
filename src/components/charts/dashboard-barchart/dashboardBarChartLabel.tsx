interface BarLabelProps {
  x?: number | string;
  y?: number | string;
  width?: number;
  value?: number | string;
  total: number;
}

export function renderBarLabel(total: number) {
  return ({ x, y, width = 0, value }: BarLabelProps) => {
    if (value == null || !total) return null;

    const numericValue = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(numericValue)) return null;

    const percent = ((numericValue / total) * 100).toFixed(1);
    const xPos = typeof x === 'number' ? x : Number(x);
    const yPos = typeof y === 'number' ? y : Number(y);

    return (
      <text
        x={xPos + width / 2}
        y={yPos + width / 6}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={14}
        fontWeight={600}
      >
        {percent}%
      </text>
    );
  };
}
