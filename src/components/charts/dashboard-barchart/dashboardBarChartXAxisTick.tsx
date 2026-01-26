import { useMemo } from "react";

interface CustomXAxisTickProps {
  x?: number | string;
  y?: number | string;
  payload?: { value: string | number };
  percentChangeByLabel: Record<string, string>;
  absoluteValueLabel: Record<string, number>;
  containerWidth?: number; 
}

export function CustomXAxisTick({
  x,
  y,
  payload,
  percentChangeByLabel,
  absoluteValueLabel = {},
  containerWidth = 0,
}: CustomXAxisTickProps) {
  if (!payload || x == null || y == null) return null;

  const xNum = Number(x);
  const yNum = Number(y);
  if (Number.isNaN(xNum) || Number.isNaN(yNum)) return null;

  const labelKey = String(payload.value);

  const percentChange = percentChangeByLabel[labelKey];
  const absoluteValue = absoluteValueLabel?.[labelKey]
  const formattedValue = absoluteValue != null ? absoluteValue.toLocaleString() : '-'

  // Decide rotation and font size dynamically
  const { rotateAngle, fontSize, dyLabel, dyValue, dyPercent, dxPercent } = useMemo(() => {
    if (containerWidth < 50) {
      return { 
        rotateAngle: -45, 
        fontSize: 10, 
        dyLabel: 12, 
        dyValue: 24,
        dyPercent: 36, 
        dxPercent: -10 };
    } else if (containerWidth < 200) {
      return { 
        rotateAngle: -30, 
        fontSize: 10, 
        dyLabel: 14,
        dyValue: 28,
        dyPercent: 42, 
        dxPercent: -10 };
    }
    return { 
      rotateAngle: 0, 
      fontSize: 12, 
      dyLabel: 16, 
      dyValue: 32,
      dyPercent: 48 
    };
  }, [containerWidth]);

  const textAnchor = rotateAngle ? "end" : "middle";

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Main label */}
      <text
        x={0}
        y={0}
        dy={dyLabel}
        textAnchor={textAnchor}
        fill="#000"
        fontWeight={500}
        fontSize={fontSize}
        transform={rotateAngle ? `rotate(${rotateAngle})` : undefined}
      >
        {labelKey}
      </text>

      <text
        dy={dyValue}
        textAnchor={textAnchor}
        fill="#444"
        fontSize={fontSize}
        transform={rotateAngle ? `rotate(${rotateAngle})` : undefined} 
      >
        {formattedValue}
      </text>

      {/* Percentage label */}
      <text
        x={0}
        y={0}
        dy={dyPercent}
        dx={dxPercent}
        textAnchor={textAnchor}
        fill={
          percentChange?.startsWith("+")
            ? "#2e7d32"
            : percentChange?.startsWith("-")
            ? "#c62828"
            : "#999"
        }
        fontSize={fontSize}
        transform={rotateAngle ? `rotate(${rotateAngle})` : undefined}
      >
        {percentChange}
      </text>
    </g>
  );
}
