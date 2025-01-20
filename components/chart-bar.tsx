'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export function ChartBar({ data }: { data: any }) {
  const chartData = data.map((item: any, i: number) => {
    return {
      sentiment: item.sentiment,
      cnt: item.cnt,
      fill: `hsl(var(--chart-${i + 1}))`,
    };
  });

  const chartConfig = chartData.reduce((acc: ChartConfig, cur: any) => {
    acc[cur.sentiment] = {
      label: cur.sentiment,
      color: cur.fill,
    };
    return acc;
  }, {});

  // console.log('aaa', {chartConfig, chartData});
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Distribution</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="sentiment"
              tickFormatter={(value) => value.slice(0, 12)}
              tickLine={false}
              tickMargin={10}
            />

            <YAxis />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="cnt"
              label={(a) => {
                const { x, y, value, className } = a;
                return (
                  <text
                    className={className}
                    fill="hsl(var(--muted-foreground))"
                    fontSize={12}
                    x={x + 16}
                    y={y - 10}
                  >
                    {value.toLocaleString()}
                  </text>
                );
              }}
              radius={[4, 4, 0, 0]}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
