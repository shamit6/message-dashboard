'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
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
        <CardTitle className="text-5xl">Sentiment Distribution</CardTitle>
        <CardDescription className="text-2xl">
          {format(new Date(), 'PP')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="sentiment"
              fontSize={28}
              tickFormatter={(value) => value}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              fontSize={24}
              tickCount={5}
              tickFormatter={(value) =>
                value.toLocaleString('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short',
                })
              }
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              isAnimationActive={false}
              dataKey="cnt"
              label={({ x, y, value, className, viewBox }) => {
                return (
                  <text
                    // className={className}
                    fill="hsl(var(--muted))"
                    fontSize={28}
                    x={x + viewBox.width / 2 - 40}
                    y={y + 30}
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
