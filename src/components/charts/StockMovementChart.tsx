
import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  Line, 
  LineChart, 
  CartesianGrid, 
  Tooltip, 
  XAxis, 
  YAxis,
  ResponsiveContainer,
  Legend
} from "recharts";

interface StockMovementChartProps {
  data: any[];
  categories: string[];
  index: string;
  colors?: string[];
  yAxisWidth?: number;
  showLegend?: boolean;
  showGridLines?: boolean;
  className?: string;
}

export function StockMovementChart({ 
  data, 
  categories, 
  index, 
  colors = ["#10b981", "#ef4444"], 
  yAxisWidth = 40,
  showLegend = true,
  showGridLines = true,
  className 
}: StockMovementChartProps) {
  const config = categories.reduce((acc, category, i) => {
    return {
      ...acc,
      [category]: {
        color: colors[i % colors.length],
      },
    };
  }, {});

  return (
    <ChartContainer config={config} className={className}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        {showGridLines && (
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        )}
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          width={yAxisWidth}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          style={{ fontSize: "12px" }}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
        />
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        ))}
        {showLegend && <Legend verticalAlign="bottom" height={36} />}
      </LineChart>
    </ChartContainer>
  );
}
