
import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  CartesianGrid, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

interface BarChartProps {
  data: any[];
  categories: string[];
  index: string;
  colors?: string[];
  yAxisWidth?: number;
  showLegend?: boolean;
  showGridLines?: boolean;
  className?: string;
}

export function BarChart({ 
  data, 
  categories, 
  index, 
  colors = ["#3b82f6"], 
  yAxisWidth = 40,
  showLegend = false,
  showGridLines = false,
  className 
}: BarChartProps) {
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
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          <Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
}
