import "./dashboardBarChart.css";
import { useBarChartPercentages } from "./useBarChartPercentages";
import { renderBarLabel } from "./dashboardBarChartLabel";
import { CustomTooltip } from "./dashboardBarChartToolTip";
import { CustomXAxisTick } from "./dashboardBarChartXAxisTick";
import { useCallback } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BarDatum {
  name: string;
  value: number;
}

interface BarChartProps {
  data: BarDatum[];
  title?: string;
}

interface XAxisTickBaseProps {
  x?: number | string;
  y?: number | string;
  payload?: { value: string | string };
  width?: number; 
}

export function BarChart({ data, title }: BarChartProps) {
  const { total, ordered, percentChangeMap, absoluteValueMap } = useBarChartPercentages(data);
  
  const renderXAxisTick = useCallback(
    (props: XAxisTickBaseProps) => {
      const chartWidth = props.width ?? window.innerWidth; 
      return (
        <CustomXAxisTick
          {...props}
          percentChangeByLabel={percentChangeMap}
          absoluteValueLabel={absoluteValueMap}
          containerWidth={chartWidth}
        />
      );
    },
    [percentChangeMap, absoluteValueMap]
  );

  return (
    <div className="chart-card">
      {title && <h3 className="chart-title">{title}</h3>}

      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={ordered} margin={{ top: 4, bottom: 30 }}>
          <XAxis
            dataKey="name"
            tick={renderXAxisTick}
            interval={0} 
          />
          <YAxis className="yaxis-labels" />
          <Tooltip content={<CustomTooltip total={total} />} />
          <Bar dataKey="value" fill="#4f959d" label={renderBarLabel(total)} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
