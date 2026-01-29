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
  const { rotateAngle, fontSize, dyLabel, dyValue, dyPercent, dxPercent, showMainLabel } = useMemo(() => {
    if (containerWidth < 50) {
      return { 
        rotateAngle: 0, 
        fontSize: 10, 
        dyLabel: 10, 
        dyPercent: 30, 
        dxPercent: 0,
        showMainLabel: false };
    } else if (containerWidth < 250) {
      return { 
        rotateAngle: 0, 
        fontSize: 12, 
        dyValue: 10,
        dyPercent: 30, 
        dxPercent: 0,
        showMainLabel: false };
    }
    return { 
      rotateAngle: 0, 
      fontSize: 12, 
      dyLabel: 16, 
      dyValue: 32,
      dyPercent: 48,
      showMainLabel: true
    };
  }, [containerWidth]);

  const textAnchor = rotateAngle ? "end" : "middle";

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Main label */}
      {showMainLabel && (
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
      )}

      {/* Whole number label */}
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
