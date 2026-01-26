import './dashboardStackedChart.css'
import { useState } from "react";
import { STACK_COLOR } from "../../../utils/stackColors";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { AcademicYearTick } from "./dashboardStackedChartTick";
import { CustomStackedTooltip } from "./dashboardStackedChartToolTip";
import { renderPercentLabel } from "./renderPercentLabel";
import { useStackedBarDataProcessed } from "./useStackedBarDataProcessed";

interface StackedRow {
  name: string;
  [key: string]: number | string; 
}

interface StackedBarChartProps {
  title?: string;
  data: StackedRow[];
  keys: string[];
  isPercent?: boolean;
  isHorizontal?: boolean;
  fillHeight?: boolean;
}

export function StackedBarChart({
  title,
  data,
  keys,
  isPercent,
  isHorizontal,
  fillHeight = false
}: StackedBarChartProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const { ordered, yearMeta } = useStackedBarDataProcessed(data, keys, !isHorizontal);

  return (
    <div className={`chart-wrapper ${fillHeight ? "fill-height" : ""}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="chart-body">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          className="stacked-chart-wrapper"
          data={ordered}
          layout={isHorizontal ? "vertical" : "horizontal"}
          margin={{ top: 16, right: 14, left: 14, bottom: 16 }}
        >
          {isHorizontal ? (
            <>
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(v) => `${Math.round(v)}%`}
                ticks={[0, 25, 50, 75, 100]}
                style={{fontSize: 14, fill: '#000'}}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 14, fill: '#000' }}
              />
            </>
          ) : (
            <>
              <XAxis
                type="category" 
                dataKey="name" 
                height={40}
                tick={(props) => (
                  <AcademicYearTick {...props} yearMeta={yearMeta}/>
                )}
                />
              <YAxis 
                type="number"
                domain={[0, 100]}
                tickFormatter={(v) => `${Math.round(v)}%`}
                ticks={[0, 25, 50, 75, 100]}
                style={{fontSize: 14, fill: '#000'}}
              />
            </>
          )}
          <Tooltip
            content={
              <CustomStackedTooltip
                isPercent={isPercent}
                activeKey={activeKey}
              />
            }
          />
          <Legend verticalAlign="top" align="left" />
          {keys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="stack"
              fill={STACK_COLOR[key] ?? "#90a4ae"}
              isAnimationActive={false}
              onMouseOver={() => setActiveKey(key)}
              onMouseOut={() => setActiveKey(null)}
            >
              <LabelList
                dataKey={key}
                position={isHorizontal ? "insideRight" : "insideTop"}
                formatter={isPercent ? renderPercentLabel : () => ""}
                fill="#fff"
                fontSize={14}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
