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

// const chartData = [
//   { month: 'January', desktop: 186, mobile: 80 },
//   { month: 'February', desktop: 305, mobile: 200 },
//   { month: 'March', desktop: 237, mobile: 120 },
//   { month: 'April', desktop: 73, mobile: 190 },
//   { month: 'May', desktop: 209, mobile: 130 },
//   { month: 'June', desktop: 214, mobile: 140 },
// ]

// const chartConfig = {
//   // cnt: {
//   //   label: 'cnt',
//   // },
//   unsubstantial: {
//     label: 'unsubstantial',
//     color: 'hsl(var(--chart-1))',
//   },
//   likely_to_reject: {
//     label: 'likely_to_reject',
//     color: 'hsl(var(--chart-2))',
//   },
//   incoherent: {
//     label: 'incoherent',
//     color: 'hsl(var(--chart-3))',
//   },
//   attack_on_commenter: {
//     label: 'attack_on_commenter',
//     color: 'hsl(var(--chart-4))',
//   },
//   affinity_experimental: {
//     label: 'affinity_experimental',
//     color: 'hsl(var(--chart-5))',
//   },
//   inflammatory: {
//     label: 'inflammatory',
//     color: 'hsl(var(--chart-6))',
//   },
// } satisfies ChartConfig;

export function ChartBar({ data }: { data: any }) {
  const chartData = data.map((item: any, i: number) => {
    return {
      sentiment: item.sentiment,
      cnt: item.cnt,
      // @ts-expect-error
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
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
              label={({ x, y, value, className }) => {
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
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
